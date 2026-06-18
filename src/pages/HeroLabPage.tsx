import { HeroSplit, HeroOverCity } from '../components/hero/HeroVariants';

const VariantLabel = ({ tag, title, desc }: { tag: string; title: string; desc: string }) => (
  <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
    <div className="inline-flex flex-col items-center text-center bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl border border-white/15">
      <span className="text-[10px] font-bold tracking-[0.3em] text-[#FEC001] uppercase">{tag}</span>
      <span className="text-sm font-bold">{title}</span>
      <span className="text-[11px] text-white/60 max-w-xs">{desc}</span>
    </div>
  </div>
);

export const HeroLabPage = () => {
  return (
    <div className="relative">
      {/* Variant A */}
      <div className="relative">
        <VariantLabel
          tag="Variant A"
          title="Over the living city"
          desc="Scooter glides over your animated smart-city. Scroll to drive it across."
        />
        <HeroOverCity />
      </div>

      {/* Variant B */}
      <div className="relative">
        <VariantLabel
          tag="Variant B"
          title="Split · Argo-style"
          desc="Clean cream panel, bold headline. Scroll to drive the scooter across."
        />
        <HeroSplit />
      </div>

      {/* footnote */}
      <div className="bg-[#15171C] text-center py-10 text-white/50 text-sm">
        Hero Lab — both run the same branded 3D scooter. Tell me which vibe wins (or mix them).
      </div>
    </div>
  );
};
