"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PackageCard } from "@/components/PackageCard";
import { PromoCountdown } from "@/components/PromoCountdown";
import {
  getPayableAmount,
  isPromoActive,
  PACKAGES,
  type PriceTier,
} from "@/lib/pricing";
import { loadJourney, saveJourney } from "@/lib/storage";

function PackagesInner() {
  const router = useRouter();
  const search = useSearchParams();
  const recommend = search.get("recommend") ?? undefined;
  const [selected, setSelected] = useState<string>("");
  const [promoOn, setPromoOn] = useState(true);

  useEffect(() => {
    setPromoOn(isPromoActive());
    const j = loadJourney();
    const initial =
      search.get("recommend") ||
      j.selectedPackageId ||
      j.recommendedPackageId ||
      "build-standard";
    setSelected(initial);
  }, [search]);

  const groups: { title: string; items: PriceTier[] }[] = [
    {
      title: "تشخیص",
      items: PACKAGES.filter((p) => p.kind === "diagnosis"),
    },
    {
      title: "ساخت",
      items: PACKAGES.filter((p) => p.kind === "build"),
    },
    {
      title: "ارتقا و بازسازی",
      items: PACKAGES.filter(
        (p) => p.kind === "upgrade" || p.kind === "rebuild"
      ),
    },
    {
      title: "تولید مستمر (ماهانه)",
      items: PACKAGES.filter((p) => p.kind === "retainer"),
    },
  ];

  function continuePay() {
    const pkg = PACKAGES.find((p) => p.id === selected);
    if (!pkg) return;
    const amount = getPayableAmount(pkg);
    saveJourney({
      selectedPackageId: pkg.id,
      recommendedPackageId:
        loadJourney().recommendedPackageId ?? recommend ?? pkg.id,
    });
    router.push(`/payment?package=${pkg.id}&amount=${amount}&project=mouri`);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">قیمت‌گذاری</p>
        <h1 className="text-3xl font-black text-bone">بسته‌ها</h1>
        <p className="mt-2 text-sm text-white/55">
          {promoOn
            ? "قیمت ویژه فعال است. بعد از پایان پرومو فقط مبلغ اصلی دیده می‌شود."
            : "پرومو تمام شده — قیمت‌های اصلی."}
        </p>
      </div>

      <PromoCountdown />

      {groups.map((g) => (
        <section key={g.title} className="space-y-3">
          <h2 className="text-lg font-bold text-bone">{g.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.items.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={selected === pkg.id}
                recommended={recommend === pkg.id}
                onSelect={() => setSelected(pkg.id)}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/90 p-4 backdrop-blur">
        <p className="text-sm text-white/60">
          بسته انتخابی:{" "}
          <span className="font-bold text-bone">
            {PACKAGES.find((p) => p.id === selected)?.nameFa ?? "—"}
          </span>
        </p>
        <div className="flex gap-2">
          <Link href="/summary" className="btn-ghost !px-4 !py-2 text-xs">
            بازگشت
          </Link>
          <button
            type="button"
            className="btn-primary !px-5 !py-2"
            onClick={continuePay}
            disabled={!selected}
          >
            ادامه به پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense
      fallback={<p className="text-center text-white/50">بارگذاری بسته‌ها…</p>}
    >
      <PackagesInner />
    </Suspense>
  );
}
