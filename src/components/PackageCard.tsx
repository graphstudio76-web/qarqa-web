"use client";

import type { PriceTier } from "@/lib/pricing";
import { getDisplayPrice } from "@/lib/pricing";

type Props = {
  pkg: PriceTier;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: () => void;
};

export function PackageCard({
  pkg,
  selected,
  recommended,
  onSelect,
}: Props) {
  const price = getDisplayPrice(pkg);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full rounded-2xl border p-5 text-right transition ${
        selected
          ? "border-violet-400/70 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.25)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
      }`}
    >
      {recommended && (
        <span className="absolute -top-2 left-4 rounded-full bg-gradient-to-l from-cyan-400 via-violet-500 to-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-black">
          پیشنهاد قارقا
        </span>
      )}
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-bone">{pkg.nameFa}</h3>
        {price.isPromo && (
          <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
            پرومو
          </span>
        )}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-white/55">
        {pkg.descriptionFa}
      </p>
      <div className="space-y-1">
        {price.crossed && (
          <div className="text-sm text-white/40 line-through">
            {price.crossed}
          </div>
        )}
        <div className="text-xl font-bold text-iridescent">{price.label}</div>
      </div>
    </button>
  );
}
