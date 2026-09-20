"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  formatToman,
  getPackageById,
  getPayableAmount,
} from "@/lib/pricing";
import { STAGES } from "@/lib/stages";
import { saveJourney } from "@/lib/storage";

/**
 * Mock payment UI — interface shaped for future Zarinpal / IDPay adapters.
 * No real PSP call in Phase 1.
 */
function PaymentInner() {
  const router = useRouter();
  const search = useSearchParams();
  const packageId = search.get("package") ?? "build-standard";
  const pkg = getPackageById(packageId);
  const amountParam = search.get("amount");
  const amount = useMemo(() => {
    if (amountParam && !Number.isNaN(Number(amountParam))) {
      return Number(amountParam);
    }
    return pkg ? getPayableAmount(pkg) : 0;
  }, [amountParam, pkg]);

  const [method, setMethod] = useState<"zarinpal" | "idpay" | "mock">("mock");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!pkg) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-white/60">بسته پیدا نشد.</p>
        <Link href="/packages" className="btn-primary">
          بازگشت به بسته‌ها
        </Link>
      </div>
    );
  }

  async function mockPay(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("نام و موبایل را وارد کن.");
      return;
    }
    setBusy(true);
    setError("");
    // Simulate gateway latency
    await new Promise((r) => setTimeout(r, 900));
    const unlocked = STAGES.map((s) => s.id);
    saveJourney({
      selectedPackageId: packageId,
      paid: true,
      paidAt: new Date().toISOString(),
      paidAmount: amount,
      paidPackageName: pkg!.nameFa,
      unlockedStages: unlocked,
      currentStageId: "flock",
    });
    setBusy(false);
    router.push("/flight?unlocked=1");
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">پرداخت</p>
        <h1 className="text-3xl font-black text-bone">تأیید و پرداخت</h1>
        <p className="mt-2 text-sm text-white/55">
          در فاز ۱ پرداخت آزمایشی است. رابط برای زرین‌پال و آیدی‌پی آماده است.
        </p>
      </div>

      <div className="card-surface space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">بسته</span>
          <span className="font-bold text-bone">{pkg.nameFa}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">مبلغ</span>
          <span className="text-lg font-bold text-iridescent">
            {formatToman(amount)}
          </span>
        </div>
      </div>

      <form onSubmit={mockPay} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm text-white/70">نام</span>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام و نام خانوادگی"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-white/70">موبایل</span>
          <input
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxxx"
            inputMode="tel"
            dir="ltr"
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm text-white/70">درگاه</legend>
          {(
            [
              { id: "mock", label: "پرداخت آزمایشی (فعلاً)", ready: true },
              {
                id: "zarinpal",
                label: "زرین‌پال (به‌زودی)",
                ready: false,
              },
              { id: "idpay", label: "آیدی‌پی (به‌زودی)", ready: false },
            ] as const
          ).map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                method === m.id
                  ? "border-violet-400/60 bg-violet-500/10"
                  : "border-white/10"
              } ${!m.ready ? "opacity-50" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name="gateway"
                disabled={!m.ready}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="accent-violet-500"
              />
              <span className="text-sm text-bone">{m.label}</span>
            </label>
          ))}
        </fieldset>

        {error && (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "در حال اتصال به درگاه…" : "پرداخت آزمایشی و باز کردن مسیر"}
        </button>
        <p className="text-center text-[11px] text-white/35">
          هیچ مبلغ واقعی کسر نمی‌شود. localStorage وضعیت را نگه می‌دارد.
        </p>
      </form>

      <Link href="/packages" className="btn-ghost w-full text-center text-sm">
        بازگشت به بسته‌ها
      </Link>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={<p className="text-center text-white/50">بارگذاری پرداخت…</p>}
    >
      <PaymentInner />
    </Suspense>
  );
}
