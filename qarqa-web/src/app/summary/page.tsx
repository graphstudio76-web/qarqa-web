"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDisplayPrice, getPackageById } from "@/lib/pricing";
import { loadJourney, type JourneyState } from "@/lib/storage";
import { PromoCountdown } from "@/components/PromoCountdown";

const MATURITY_LABEL: Record<string, string> = {
  none: "از صفر",
  early: "شروع / پراکنده",
  growing: "در حال رشد",
  broken: "نیاز به ریبرند",
};

const BUDGET_LABEL: Record<string, string> = {
  low: "محدود",
  mid: "متوسط",
  high: "باز",
  premium: "پرمیوم",
};

const GOAL_LABEL: Record<string, string> = {
  build: "ساخت",
  upgrade: "ارتقا",
  rebuild: "بازسازی",
  content: "تولید مستمر",
};

export default function SummaryPage() {
  const router = useRouter();
  const [journey, setJourney] = useState<JourneyState | null>(null);

  useEffect(() => {
    const j = loadJourney();
    if (!j.diagnosis) {
      router.replace("/diagnose");
      return;
    }
    setJourney(j);
  }, [router]);

  if (!journey?.diagnosis) {
    return (
      <p className="text-center text-white/50">در حال بارگذاری…</p>
    );
  }

  const pkg = getPackageById(journey.recommendedPackageId ?? "");
  const price = pkg ? getDisplayPrice(pkg) : null;
  const d = journey.diagnosis;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">خلاصه تشخیص</p>
        <h1 className="text-3xl font-black text-bone">
          {d.brandName ? `برند «${d.brandName}»` : "برند تو"}
        </h1>
        <p className="mt-2 text-sm text-white/55">
          این تصویر اولیه‌ست. بعداً در ریشه‌کاری دقیق‌تر می‌شه.
        </p>
      </div>

      <div className="card-surface space-y-3 text-sm">
        <Row label="بلوغ" value={MATURITY_LABEL[d.maturity] ?? d.maturity} />
        <Row label="صنعت" value={d.industry} />
        <Row
          label="هدف‌ها"
          value={d.goals.map((g) => GOAL_LABEL[g] ?? g).join("، ")}
        />
        <Row label="بودجه" value={BUDGET_LABEL[d.budget] ?? d.budget} />
        {d.notes && <Row label="یادداشت" value={d.notes} />}
      </div>

      {pkg && price && (
        <div className="rounded-2xl border border-violet-400/40 bg-gradient-to-l from-violet-950/50 to-cyan-950/30 p-6">
          <p className="mb-1 text-xs text-violet-200/70">پیشنهاد قارقا</p>
          <h2 className="text-2xl font-bold text-bone">{pkg.nameFa}</h2>
          <p className="mt-2 text-sm text-white/60">{pkg.descriptionFa}</p>
          <div className="mt-4">
            {price.crossed && (
              <div className="text-sm text-white/40 line-through">
                {price.crossed}
              </div>
            )}
            <div className="text-xl font-bold text-iridescent">
              {price.label}
            </div>
          </div>
        </div>
      )}

      <PromoCountdown compact />

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/packages?recommend=${journey.recommendedPackageId ?? ""}`}
          className="btn-primary"
        >
          انتخاب بسته و قیمت
        </Link>
        <Link href="/diagnose" className="btn-ghost">
          اصلاح پاسخ‌ها
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-white/5 pb-2 last:border-0">
      <span className="text-white/45">{label}</span>
      <span className="text-bone">{value}</span>
    </div>
  );
}
