import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CaptionStat = { value: string; label: string; icon?: LucideIcon };

type SlideOverlayProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  /** The tab's list (steps, rules, features), laid out by the page for a dark backdrop. */
  details?: ReactNode;
  stats?: CaptionStat[];
  cta?: ReactNode;
  active: boolean;
};

/**
 * All of a tab carousel card's copy, set over its photo. A dark fade sits under the text (from the
 * left on wider cards, so the rest of the photo stays clear; from the bottom on phones) and the
 * type is white, so it stays readable on any image. Only the card in focus shows its text.
 */
export const SlideOverlay = ({ icon: Icon, eyebrow, title, description, details, stats = [], cta, active }: SlideOverlayProps) => (
  <div className={`absolute inset-0 transition-opacity duration-500 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!active}>
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/20 md:bg-gradient-to-r md:from-black/90 md:via-black/75 md:to-transparent" />
    <div className="absolute inset-0 hidden bg-gradient-to-t from-black/40 to-transparent md:block" />
    <div className="relative flex h-full flex-col justify-end gap-4 p-5 sm:p-8 md:w-[74%] xl:w-[62%] md:justify-center md:gap-5 lg:p-10 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
      <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FEC001] text-black text-[10px] font-bold rounded-full mb-2.5 tracking-widest uppercase [text-shadow:none]">
          <Icon className="w-3 h-3" aria-hidden />
          {eyebrow}
        </span>
        <h3 className="font-bold font-display text-white leading-[1.1] tracking-tight text-2xl sm:text-3xl">{title}</h3>
        <p className="mt-2 text-white/85 leading-relaxed text-[13px] sm:text-[15px]">{description}</p>
      </div>
      {details}
      {stats.length > 0 && (
        <dl className="flex flex-wrap gap-x-7 gap-y-2">
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="flex items-center gap-2">
              {stat.icon && <stat.icon className="w-4 h-4 text-[#FEC001]" aria-hidden />}
              <div>
                <dt className="sr-only">{stat.label || stat.value}</dt>
                <dd className="font-display font-bold text-sm text-white leading-tight">{stat.value}</dd>
                {stat.label && <dd className="text-[11px] text-white/65 leading-tight">{stat.label}</dd>}
              </div>
            </div>
          ))}
        </dl>
      )}
      {cta}
    </div>
  </div>
);

/** A numbered (or checked) list for a dark backdrop, two columns when long. */
export const CaptionList = ({ items, marker = 'number' }: { items: string[]; marker?: 'number' | 'check' }) => (
  // Columns (not a grid) so numbering runs down the first column, then the second.
  <ol className={`gap-x-6 ${items.length > 4 ? 'columns-2' : ''}`}>
    {items.map((item, i) => (
      <li key={item} className="flex items-start gap-2.5 mb-1.5 last:mb-0 break-inside-avoid text-[12px] sm:text-[13px] leading-snug text-white/90">
        <span
          className={`mt-px w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold [text-shadow:none] ${
            marker === 'number' ? 'bg-[#FEC001] text-black' : 'bg-[#FEC001]/20 text-[#FEC001]'
          }`}
          aria-hidden
        >
          {marker === 'number' ? i + 1 : <Check className="w-3 h-3" />}
        </span>
        {item}
      </li>
    ))}
  </ol>
);

/** Solutions-style call to action: a solid pill with an arrow. */
export const CAPTION_CTA =
  'group/cta inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] text-black bg-[#FEC001] [text-shadow:none]';
