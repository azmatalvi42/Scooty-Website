import { SiteImage } from './SiteImage';

export type MarqueePartner = { name: string; img?: string };

/** One partner: logo tile (or its initials when there's no logo) and name, nothing else. */
const PartnerMark = ({ partner }: { partner: MarqueePartner }) => (
  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 select-none">
    {/* Slightly wide tile: most partner logos are wordmarks, which would shrink in a square. */}
    <div className="w-14 h-11 sm:w-16 sm:h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
      {partner.img
        ? <SiteImage src={partner.img} alt={partner.name} className="w-full h-full object-contain p-1.5" />
        : <span className="text-xs font-black tracking-wider text-[#303932]" aria-hidden>{partner.name.slice(0, 3).toUpperCase()}</span>}
    </div>
    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white whitespace-nowrap">
      {partner.name}
    </span>
  </div>
);

/** Partners per copy of a row: enough to span the widest row (1152 px) so the loop never shows a gap. */
const MIN_PER_COPY = 8;

/**
 * One marquee row. The row's partners are repeated until one copy spans the row, that copy is rendered
 * twice (each carrying its trailing gap), and the track slides by exactly one copy (-50%), so the loop
 * point is pixel-identical to the start: no visible reset.
 */
const PartnerRow = ({ partners, reverse = false }: { partners: MarqueePartner[]; reverse?: boolean }) => {
  const repeats = Math.max(1, Math.ceil(MIN_PER_COPY / partners.length));
  const copy = Array.from({ length: repeats }, () => partners).flat();
  return (
    <div className={`partners-marquee-row${reverse ? ' partners-marquee-row--reverse' : ''}`}>
      <div className="partners-marquee-track">
        {[0, 1].map(half => (
          <div key={half} className="partners-marquee-group" aria-hidden={half === 1 || undefined}>
            {copy.map((partner, i) => <PartnerMark key={`${partner.name}-${i}`} partner={partner} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Two rows of partner logos moving opposite ways: `top` scrolls left, `bottom` scrolls right. */
export const PartnerMarquee = ({ top, bottom }: { top: MarqueePartner[]; bottom: MarqueePartner[] }) => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
    <PartnerRow partners={top} />
    <PartnerRow partners={bottom} reverse />
  </div>
);
