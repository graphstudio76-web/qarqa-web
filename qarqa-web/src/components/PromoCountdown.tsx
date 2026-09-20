"use client";

import { useEffect, useState } from "react";
import { isPromoActive, PROMO_END_ISO } from "@/lib/pricing";

type Parts = { d: number; h: number; m: number; s: number };

function diffParts(end: Date, now: Date): Parts | null {
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function PromoCountdown({ compact = false }: { compact?: boolean }) {
  const [parts, setParts] = useState<Parts | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const end = new Date(PROMO_END_ISO);
    const tick = () => {
      const now = new Date();
      setActive(isPromoActive(now));
      setParts(diffParts(end, now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!active || !parts) {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 ${
          compact ? "px-3 py-2 text-sm" : "px-4 py-3"
        }`}
      >
        <p className="text-bone/80">
          پرومو به پایان رسیده. قیمت‌های اصلی اعمال می‌شود.
        </p>
      </div>
    );
  }

  const cell = (n: number, label: string) => (
    <div className="flex min-w-[3.2rem] flex-col items-center rounded-lg bg-black/50 px-2 py-1.5">
      <span className="font-mono text-lg font-bold text-iridescent tabular-nums sm:text-xl">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-white/50">{label}</span>
    </div>
  );

  return (
    <div
      className={`rounded-xl border border-violet-500/30 bg-gradient-to-l from-violet-950/40 via-black to-cyan-950/30 ${
        compact ? "px-3 py-2" : "px-4 py-4"
      }`}
    >
      <p className={`mb-2 font-medium text-bone ${compact ? "text-sm" : ""}`}>
        قیمت ویژه تا پایان شمارش
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {cell(parts.d, "روز")}
        {cell(parts.h, "ساعت")}
        {cell(parts.m, "دقیقه")}
        {cell(parts.s, "ثانیه")}
      </div>
      <p className="mt-2 text-xs text-white/55">
        بعد از این تاریخ قیمت به مبلغ اصلی برمی‌گردد.
      </p>
    </div>
  );
}
