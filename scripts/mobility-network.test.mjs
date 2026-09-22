import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function compile(file, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, ...globals });
  return exports;
}
const trafficModule = compile('src/components/ui/mobility/traffic.ts');
const sceneModule = compile('src/components/ui/mobility/scene.ts', { require: () => trafficModule });
const scene = sceneModule.createMobilityScene();
const key = p => `${p.x},${p.y}`;

test('all vehicle routes follow connected streets and meet a transit hub', () => {
  const edges = new Set();
  for (const street of scene.streets) {
    for (let i = 1; i < street.length; i++) {
      edges.add(`${key(street[i - 1])}|${key(street[i])}`);
      edges.add(`${key(street[i])}|${key(street[i - 1])}`);
    }
  }
  const hubKeys = new Set(scene.hubs.map(key));
  for (const route of scene.routes) {
    assert.ok(route.length > 0);
    for (let i = 1; i < route.points.length; i++) {
      assert.ok(edges.has(`${key(route.points[i - 1])}|${key(route.points[i])}`));
    }
    assert.ok(route.points.some(p => hubKeys.has(key(p))));
  }
  for (const hub of scene.hubs) {
    assert.ok(scene.routes.some(r => r.transit && r.points.some(p => key(p) === key(hub))));
  }
});

test('distance sampling reaches both ends and stays finite through every turn', () => {
  for (const route of scene.routes) {
    assert.equal(key(sceneModule.routePoint(route, 0)), key(route.points[0]));
    const end = sceneModule.routePoint(route, route.length);
    assert.ok(Math.hypot(end.x - route.points.at(-1).x, end.y - route.points.at(-1).y) < .0001);
    for (const d of route.lengths) {
      const p = sceneModule.routePoint(route, d);
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.angle));
    }
  }
});

test('city geometry is deterministic and transit hubs have shelters and scooter docks', () => {
  assert.equal(JSON.stringify(sceneModule.createMobilityScene()), JSON.stringify(scene));
  assert.equal(scene.scenery.filter(o => o.kind === 'shelter').length, scene.hubs.length);
  assert.equal(scene.scenery.filter(o => o.kind === 'dock').length, scene.hubs.length);
  assert.ok(scene.scenery.some(o => o.kind === 'building' && o.height > 100));
  assert.ok(scene.scenery.filter(o => o.kind === 'tree').length > 50);
});

function context() {
  let calls = 0;
  return {
    get calls() { return calls; },
    ctx: new Proxy({}, {
      get: (_, name) => name === 'createRadialGradient' ? () => ({ addColorStop() {} }) : (...args) => {
        calls++;
        for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `Invalid ${String(name)} coordinate`);
      },
      set: () => true,
    }),
  };
}

test('drawing stays finite and compact mode reduces per-frame work', () => {
  const map = context();
  sceneModule.drawMobilityMap(map.ctx, scene);
  const desktop = context(), mobile = context();
  // Real frames use cached scenery sprites; count the work after that preparation.
  const cachedScene = { ...scene, sprites: new Map(scene.scenery.map(o => [o, { image: {}, x: 0, y: 0, width: 100, height: 100 }])) };
  for (const time of [0, 1, 31, 300, 3600]) {
    sceneModule.drawMobilityFlow(desktop.ctx, cachedScene, time, false);
    sceneModule.drawMobilityFlow(mobile.ctx, cachedScene, time, true);
  }
  assert.ok(mobile.calls < desktop.calls * .75);
  assert.ok(desktop.calls / 5 < 6500);
});

test('animation pauses off-screen/hidden/reduced-motion and releases resources', () => {
  let effect, cleanup, intersection, resizeCallback;
  let time = 0, counter = 0, draws = 0, mapDraws = 0;
  const frames = new Map(), listeners = new Map();
  const reduced = { matches: false, addEventListener: (_, fn) => listeners.set('motion', fn), removeEventListener: () => listeners.delete('motion') };
  const c = context().ctx;
  const canvas = { width: 0, height: 0, getContext: () => c };
  const host = { getBoundingClientRect: () => ({ width: 350, height: 310 }) };
  let ref = 0;
  const doc = { hidden: false, createElement: () => ({ ...canvas }), addEventListener: (k, fn) => listeners.set(k, fn), removeEventListener: k => listeners.delete(k) };
  const component = compile('src/components/ui/mobility/MobilityNetwork.tsx', {
    require: name => {
      if (name === 'react') return { useRef: () => ({ current: ref++ ? canvas : host }), useEffect: fn => { effect = fn; } };
      if (name === 'react/jsx-runtime') return { jsx: () => null };
      if (name === './traffic') return trafficModule;
      return { ...sceneModule, drawMobilityMap: () => mapDraws++, prepareMobilitySprites: () => {}, drawMobilityFlow: () => draws++ };
    },
    document: doc,
    window: { innerWidth: 390, devicePixelRatio: 3, matchMedia: () => reduced, addEventListener: (k, fn) => listeners.set(k, fn), removeEventListener: k => listeners.delete(k) },
    ResizeObserver: class { constructor(fn) { resizeCallback = fn; } observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} },
    performance: { now: () => time },
    requestAnimationFrame: fn => { frames.set(++counter, fn); return counter; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  component.MobilityNetwork(); cleanup = effect();
  assert.equal(frames.size, 0);
  assert.equal(canvas.width, 525); // Mobile DPR cap.
  resizeCallback(); assert.equal(mapDraws, 1); // Same-size resize does not repaint the city.
  intersection([{ isIntersecting: true }]); assert.equal(frames.size, 1);
  const before = draws;
  for (let n = 0; n < 120; n++) {
    time += 1000 / 120;
    const queued = [...frames.values()]; frames.clear(); queued.forEach(fn => fn(time));
  }
  assert.ok(draws - before <= 30);
  assert.equal(mapDraws, 1); // Static geography is cached during animation.
  doc.hidden = true; listeners.get('visibilitychange')(); assert.equal(frames.size, 0);
  doc.hidden = false; listeners.get('visibilitychange')(); assert.equal(frames.size, 1);
  intersection([{ isIntersecting: false }]); assert.equal(frames.size, 0);
  intersection([{ isIntersecting: true }]);
  reduced.matches = true; listeners.get('motion')(); assert.equal(frames.size, 0);
  reduced.matches = false; listeners.get('motion')(); assert.equal(frames.size, 1);
  cleanup(); assert.equal(frames.size, 0); assert.equal(listeners.size, 0);
});

test('recreation grounds stay clear of building footprints', () => {
  for (const field of scene.facilities) {
    for (const building of scene.scenery.filter(o => o.kind === 'building')) {
      const overlaps = building.x < field.x + field.width && building.x + building.width > field.x &&
        building.y < field.y + field.depth && building.y + building.depth > field.y;
      assert.equal(overlaps, false, `${field.kind} overlaps a building`);
    }
  }
});

test('uncached architecture and recreation draw finite coordinates at startup and later frames', () => {
  const drawing = context();
  const freshScene = sceneModule.createMobilityScene();
  for (const seconds of [0, 12.5, 1200]) sceneModule.drawMobilityFlow(drawing.ctx, freshScene, seconds, false);
  assert.ok(drawing.calls > 0);
});
