import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowUp, Bot, Check, ChevronLeft, Footprints, Mic, RotateCcw, Train } from 'lucide-react';
import { PhoneFrame, DemoNote } from './PhoneFrame';

/*
 * SCOOTY AI RideGuide as a chat on the rider's phone: answers stream in and come with the card
 * you'd act on (a route, a service check, a leave-by plan, where to park). Parking guidance follows
 * the Riders page (blue = designated parking, photo to end a ride); times are sample data.
 */

type CardKind = 'route' | 'service' | 'leave' | 'parking';
type Msg = { id: number; from: 'user' | 'ai'; text: string; card?: CardKind };

const PROMPTS: { id: string; text: string; reply: string; card: CardKind }[] = [
  { id: 'fastest', text: 'Fastest way to the GO station?', reply: 'Walk 2 min to a SCOOTY, ride about 8 min, and you’ll make the 9:14 train.', card: 'route' },
  { id: 'updates', text: 'Any service updates on my route?', reply: 'All clear right now.', card: 'service' },
  { id: 'leave', text: 'When should I leave?', reply: 'Leave by 8:58 to catch the 9:14 without rushing.', card: 'leave' },
  { id: 'parking', text: 'Where do I park at the station?', reply: 'Use the blue designated zone by the entrance.', card: 'parking' },
];

const GREETING: Msg = { id: 0, from: 'ai', text: 'Hi! I can plan trips, check service updates and help with your ride. Where to today?' };

const Leg = ({ icon, label, sub, tone }: { icon: React.ReactNode; label: string; sub: string; tone: string }) => (
  <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
    <span className={`grid h-7 w-7 place-items-center rounded-full ${tone}`}>{icon}</span>
    <span className="text-[10px] font-bold text-white">{label}</span>
    <span className="text-[9px] text-white/50">{sub}</span>
  </div>
);

const ScooterIcon = () => (
  <svg viewBox="-9 -9 18 18" className="h-4 w-4" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5-5.5h3M3-5.5l2.2 8.3M-5.5 2.8h8.7" /><circle cx="-5.3" cy="3.6" r="1.7" /><circle cx="5.5" cy="3.6" r="1.7" />
  </svg>
);

const Card = ({ kind }: { kind: CardKind }) => {
  const shell = 'mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#121a22]';
  if (kind === 'route') {
    return (
      <div className={shell}>
        <svg viewBox="0 0 220 84" className="block h-[84px] w-full" aria-hidden>
          <rect width="220" height="84" fill="#16212b" />
          <g stroke="#223140" strokeWidth="7" strokeLinecap="round"><path d="M-4 52H224M70 -4V88M160 -4V88M-4 18H224" /></g>
          <path d="M-4 70L224 26" stroke="#3b4b5a" strokeWidth="3" />
          <path d="M22 66H40V52" fill="none" stroke="#5aa9ff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.1 5" />
          <path d="M40 52H160V40" fill="none" stroke="#FEC001" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="66" r="4.5" fill="#5aa9ff" stroke="#fff" strokeWidth="1.5" />
          <circle cx="40" cy="52" r="5" fill="#FEC001" stroke="#fff" strokeWidth="1.5" />
          <circle cx="162" cy="39" r="6.5" fill="#1b6b3a" stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="flex items-start px-2 pb-3 pt-2.5">
          <Leg icon={<Footprints className="h-3.5 w-3.5 text-white" />} label="Walk" sub="2 min" tone="bg-[#2f80ed]" />
          <span className="mt-3 text-white/30">›</span>
          <Leg icon={<ScooterIcon />} label="SCOOTY" sub="8 min" tone="bg-[#FEC001]" />
          <span className="mt-3 text-white/30">›</span>
          <Leg icon={<Train className="h-3.5 w-3.5 text-white" />} label="GO Train" sub="9:14" tone="bg-[#1b6b3a]" />
        </div>
        <div className="border-t border-white/10 px-3 py-2.5">
          <div className="rounded-xl bg-[#FEC001] py-2 text-center text-[11px] font-bold text-black">Unlock nearest SCOOTY</div>
        </div>
      </div>
    );
  }
  if (kind === 'service') {
    return (
      <div className={`${shell} flex items-center gap-3 px-3 py-3`}>
        <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-emerald-500/15"><Check className="h-4 w-4 text-emerald-400" strokeWidth={3} /></span>
        <div>
          <div className="text-[12px] font-bold text-white">No disruptions on your route</div>
          <div className="text-[10px] text-white/50">Checked just now · I’ll let you know if that changes</div>
        </div>
      </div>
    );
  }
  if (kind === 'leave') {
    const rows = [['8:58', 'Leave home'], ['9:00', 'Unlock your SCOOTY'], ['9:08', 'Park at the station'], ['9:14', 'GO train departs']];
    return (
      <div className={`${shell} px-3 py-3`}>
        {rows.map(([time, what], i) => (
          <div key={time} className="flex items-stretch gap-3">
            <span className="w-8 pt-0.5 text-right text-[10px] font-bold tabular-nums text-white/60">{time}</span>
            <span className="flex flex-col items-center">
              <span className={`mt-1 h-2 w-2 rounded-full ${i === 0 ? 'bg-[#FEC001]' : 'bg-white/30'}`} />
              {i < rows.length - 1 && <span className="w-px flex-1 bg-white/15" />}
            </span>
            <span className={`pb-2.5 text-[11px] ${i === 0 ? 'font-bold text-white' : 'text-white/75'}`}>{what}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`${shell} flex items-center gap-3 px-3 py-3`}>
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border-2 border-[#2f80ed] bg-[#2f80ed]/20 text-[13px] font-black text-[#5aa9ff]">P</span>
      <div>
        <div className="text-[12px] font-bold text-white">Blue zone = designated parking</div>
        <div className="text-[10px] text-white/50">Park upright, then take a photo to end your ride</div>
      </div>
    </div>
  );
};

/** Reveals a reply a few characters at a time, like a model streaming its answer. */
const StreamText = ({ text, onDone }: { text: string; onDone: () => void }) => {
  const [n, setN] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (n >= text.length) {
      done.current();
      return;
    }
    const id = window.setTimeout(() => setN((c) => Math.min(text.length, c + 3)), 22);
    return () => window.clearTimeout(id);
  }, [n, text]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] animate-pulse bg-white/70" />}
    </>
  );
};

export const RideGuideDemo = () => {
  const [ref, inView] = useInView({ threshold: 0.35, triggerOnce: true });
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [used, setUsed] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState<number | null>(null);
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);
  const busy = thinking || streaming !== null;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking, streaming]);

  const ask = (prompt: (typeof PROMPTS)[number]) => {
    if (busy || used.includes(prompt.id)) return;
    setUsed((u) => [...u, prompt.id]);
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: prompt.text }]);
    setThinking(true);
    window.setTimeout(() => {
      const id = nextId.current++;
      setThinking(false);
      setStreaming(id);
      setMessages((m) => [...m, { id, from: 'ai', text: prompt.reply, card: prompt.card }]);
    }, 900);
  };

  // Open with the most common question once the phone scrolls into view.
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const id = window.setTimeout(() => ask(PROMPTS[0]), 700);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const reset = () => {
    if (busy) return;
    setMessages([GREETING]);
    setUsed([]);
  };

  const remaining = PROMPTS.filter((p) => !used.includes(p.id));

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center px-4 py-10 sm:py-12">
      <PhoneFrame statusTone="light" screenClassName="bg-[#0b1016]">
        <div className="flex h-full flex-col pt-[48px]">
          {/* App bar */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-3 pb-2.5 pt-1">
            <ChevronLeft className="h-5 w-5 text-[#FEC001]" />
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FEC001]"><Bot className="h-4 w-4 text-black" /></span>
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-bold text-white">RideGuide</div>
              <div className="flex items-center gap-1 text-[10px] text-white/50"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />SCOOTY AI · Online</div>
            </div>
            <button type="button" onClick={reset} disabled={busy || used.length === 0} aria-label="Restart the conversation" className="grid h-7 w-7 place-items-center rounded-full text-white/50 transition-colors hover:text-white disabled:opacity-0">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Conversation */}
          <div ref={scroller} className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3 scrollbar-hide">
            <div className="text-center text-[9px] font-semibold uppercase tracking-wider text-white/30">Today 8:52</div>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={msg.from === 'user' ? 'max-w-[78%]' : 'w-[88%]'}>
                    <div
                      className={`w-fit rounded-[18px] px-3.5 py-2 text-[12px] leading-snug ${
                        msg.from === 'user' ? 'ml-auto rounded-br-md bg-[#FEC001] font-medium text-black' : 'rounded-bl-md bg-white/[0.09] text-white/90'
                      }`}
                    >
                      {streaming === msg.id ? <StreamText text={msg.text} onDone={() => setStreaming(null)} /> : msg.text}
                    </div>
                    {msg.card && streaming !== msg.id && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Card kind={msg.card} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                  <div className="flex items-center gap-1 rounded-[18px] rounded-bl-md bg-white/[0.09] px-3.5 py-3">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-white/60" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ delay: d, duration: 0.9, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestions and composer */}
          <div className="border-t border-white/[0.07] px-3 pb-6 pt-2.5">
            <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2.5 scrollbar-hide">
              {remaining.length === 0 ? (
                <span className="py-1.5 text-[11px] text-white/40">Tap ↺ to start over</span>
              ) : (
                remaining.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => ask(p)}
                    disabled={busy}
                    className="flex-shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/80 transition-colors hover:border-[#FEC001]/60 hover:text-white disabled:opacity-40"
                  >
                    {p.text}
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/[0.08] py-1.5 pl-4 pr-1.5">
              <span className="flex-1 text-[12px] text-white/40">Ask RideGuide…</span>
              <Mic className="h-4 w-4 text-white/40" />
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FEC001]"><ArrowUp className="h-4 w-4 text-black" strokeWidth={2.5} /></span>
            </div>
          </div>
        </div>
      </PhoneFrame>
      <DemoNote>Illustrative demo · tap a suggestion</DemoNote>
    </div>
  );
};
