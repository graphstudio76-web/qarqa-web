"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StagePath } from "@/components/StagePath";
import { formatToman } from "@/lib/pricing";
import {
  clearJourney,
  loadJourney,
  type JourneyState,
} from "@/lib/storage";

function FlightInner() {
  const search = useSearchParams();
  const justUnlocked = search.get("unlocked") === "1";
  const [journey, setJourney] = useState<JourneyState | null>(null);

  useEffect(() => {
    setJourney(loadJourney());
  }, []);

  if (!journey) {
    return <p className="text-center text-white/50">بارگذاری مسیر…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">مسیر پرواز</p>
        <h1 className="text-3xl font-black text-bone">پرواز برند</h1>
        <p className="mt-2 text-sm text-white/55">
          شش مرحله تا خانه. در فاز ۱ همه‌ی کار دست قارقاست — بدون بازار
          فریلنسری داخل اپ.
        </p>
      </div>

      {justUnlocked && journey.paid && (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-4 text-sm text-emerald-100">
          مسیر باز شد. مراحل چیدن دسته، ساخت، کنترل کیفیت و تحویل فعال‌اند.
        </div>
      )}

      {journey.paid ? (
        <div className="card-surface space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/45">وضعیت</span>
            <span className="text-emerald-300">پرداخت‌شده (آزمایشی)</span>
          </div>
          {journey.paidPackageName && (
            <div className="flex justify-between">
              <span className="text-white/45">بسته</span>
              <span className="text-bone">{journey.paidPackageName}</span>
            </div>
          )}
          {journey.paidAmount != null && (
            <div className="flex justify-between">
              <span className="text-white/45">مبلغ</span>
              <span className="text-bone">
                {formatToman(journey.paidAmount)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/30 p-4 text-sm text-amber-100/90">
          هنوز پرداخت نکردی. مراحل ۱ و ۲ بازند؛ بقیه بعد از پذیرش قیمت باز
          می‌شوند.
          <div className="mt-3">
            <Link href="/packages" className="btn-primary !py-2 text-xs">
              رفتن به بسته‌ها
            </Link>
          </div>
        </div>
      )}

      <StagePath
        unlocked={journey.unlockedStages}
        current={journey.currentStageId}
        paid={journey.paid}
      />

      <div className="flex flex-wrap gap-3">
        {!journey.diagnosis && (
          <Link href="/diagnose" className="btn-primary">
            شروع با تشخیص
          </Link>
        )}
        {journey.diagnosis && !journey.paid && (
          <Link href="/summary" className="btn-primary">
            ادامه از خلاصه
          </Link>
        )}
        {journey.paid && (
          <Link href="/" className="btn-ghost">
            بازگشت به خانه
          </Link>
        )}
        <button
          type="button"
          className="btn-ghost text-xs text-white/40"
          onClick={() => {
            clearJourney();
            setJourney(loadJourney());
          }}
        >
          ریست مسیر (localStorage)
        </button>
      </div>
    </div>
  );
}

export default function FlightPage() {
  return (
    <Suspense
      fallback={<p className="text-center text-white/50">بارگذاری…</p>}
    >
      <FlightInner />
    </Suspense>
  );
}
