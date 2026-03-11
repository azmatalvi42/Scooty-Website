import { useMemo } from 'react';

const COLORS = [
  '#EAB308', // yellow
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899', // pink
  '#10B981', // emerald
  '#F43F5E', // rose
];

/** Deterministic pseudo-random from a seed so SSR / re-renders stay stable */
function rand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

interface Node {
  x: number;
  y: number;
}

interface Line {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  width: number;
  opacity: number;
}

interface NetworkBackgroundProps {
  /** Overall SVG opacity (default 0.55) */
  opacity?: number;
  /** Approximate columns of nodes (default 14) */
  cols?: number;
  /** Approximate rows of nodes (default 9) */
  rows?: number;
  /** Max connections per node (default 3) */
  maxLinks?: number;
  /** Max distance to connect two nodes, in viewBox units (default 180) */
  linkRadius?: number;
  className?: string;
}

export const NetworkBackground = ({
  opacity = 0.75,
  cols = 14,
  rows = 9,
  maxLinks = 3,
  linkRadius = 180,
  className = '',
}: NetworkBackgroundProps) => {
  const VW = 1000;
  const VH = 600;

  const { nodes, lines } = useMemo(() => {
    const cellW = VW / cols;
    const cellH = VH / rows;

    /* ── Generate nodes with jitter ── */
    const nodes: Node[] = [];
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const seed = r * 100 + c;
        const jx = (rand(seed * 3) - 0.5) * cellW * 0.55;
        const jy = (rand(seed * 3 + 1) - 0.5) * cellH * 0.55;
        nodes.push({
          x: c * cellW + jx,
          y: r * cellH + jy,
        });
      }
    }

    /* ── Connect nearby nodes ── */
    const lines: Line[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < nodes.length; i++) {
      // Sort other nodes by distance
      const distances = nodes
        .map((n, j) => ({
          j,
          dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y),
        }))
        .filter(d => d.j !== i && d.dist < linkRadius)
        .sort((a, b) => a.dist - b.dist);

      // Pick up to maxLinks closest neighbours, randomly skip some for variety
      let connected = 0;
      for (const { j } of distances) {
        if (connected >= maxLinks) break;
        const key = [Math.min(i, j), Math.max(i, j)].join('-');
        if (seen.has(key)) continue;
        // Randomly skip ~30% of eligible connections for organic look
        if (rand(i * 17 + j * 31) < 0.3) continue;
        seen.add(key);

        const colorSeed = Math.floor(rand(i * 7 + j) * COLORS.length);
        lines.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          color: COLORS[colorSeed],
          width: 1.2 + rand(i + j * 3) * 1.4,
          opacity: 0.75 + rand(i * j + 1) * 0.25,
        });
        connected++;
      }
    }

    return { nodes, lines };
  }, [cols, rows, maxLinks, linkRadius]);

  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lines first so dots sit on top */}
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke={l.color}
          strokeWidth={l.width}
          opacity={l.opacity}
          strokeLinecap="round"
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const colorSeed = Math.floor(rand(i * 13) * COLORS.length);
        const r = 1.5 + rand(i * 5) * 2;
        return (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={r}
            fill={COLORS[colorSeed]}
            opacity={0.7 + rand(i) * 0.3}
          />
        );
      })}
    </svg>
  );
};
