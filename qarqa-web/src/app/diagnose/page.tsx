"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { recommendPackageId } from "@/lib/recommend";
import { saveJourney, type DiagnosisAnswers } from "@/lib/storage";

const MATURITY = [
  { id: "none", label: "هنوز برندی نداریم / از صفر" },
  { id: "early", label: "شروع کردیم؛ هویت ضعیف یا پراکنده" },
  { id: "growing", label: "رشد می‌کنیم؛ نیاز به یکپارچگی" },
  { id: "broken", label: "هویت خسته یا آسیب‌دیده — ریبرند" },
];

const INDUSTRIES = [
  "خدمات",
  "محصول / فروشگاهی",
  "فناوری",
  "غذا و نوشیدنی",
  "سلامت و زیبایی",
  "آموزش",
  "سایر",
];

const GOALS = [
  { id: "build", label: "ساخت برند از صفر" },
  { id: "upgrade", label: "ارتقا بدون تغییر هویت" },
  { id: "rebuild", label: "بازسازی کامل" },
  { id: "content", label: "تولید مستمر بعد از تحویل" },
];

const BUDGETS = [
  { id: "low", label: "محدود — شروع سبک" },
  { id: "mid", label: "متوسط — استاندارد" },
  { id: "high", label: "باز — ساخت کامل" },
  { id: "premium", label: "بدون سقف منطقی" },
];

export default function DiagnosePage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [maturity, setMaturity] = useState("");
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function toggleGoal(id: string) {
    setGoals((g) =>
      g.includes(id) ? g.filter((x) => x !== id) : [...g, id]
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!maturity || !industry || goals.length === 0 || !budget) {
      setError("همه‌ی فیلدهای اصلی را پر کن.");
      return;
    }
    const answers: DiagnosisAnswers = {
      maturity,
      industry,
      goals,
      budget,
      brandName: brandName.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    const recommendedPackageId = recommendPackageId(answers);
    saveJourney({
      diagnosis: answers,
      recommendedPackageId,
      currentStageId: "diagnosis",
      unlockedStages: ["diagnosis", "root"],
    });
    router.push("/summary");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">مرحله ۱ · تشخیص</p>
        <h1 className="text-3xl font-black text-bone">پرسشنامه‌ی تشخیص</h1>
        <p className="mt-2 text-sm text-white/55">
          کوتاه و رُک. جواب‌هات پیشنهاد بسته را می‌سازند. مبلغ تشخیص از قرارداد
          کم می‌شود.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <label className="block space-y-2">
          <span className="text-sm text-white/70">نام برند (اختیاری)</span>
          <input
            className="input-field"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="مثلاً موری"
          />
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-white/80">
            بلوغ برند کجاست؟
          </legend>
          {MATURITY.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                maturity === m.id
                  ? "border-violet-400/60 bg-violet-500/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <input
                type="radio"
                name="maturity"
                checked={maturity === m.id}
                onChange={() => setMaturity(m.id)}
                className="accent-violet-500"
              />
              <span className="text-sm text-bone">{m.label}</span>
            </label>
          ))}
        </fieldset>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">صنعت</span>
          <select
            className="input-field"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="">انتخاب کن</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-white/80">
            هدف‌ها (چندتایی)
          </legend>
          {GOALS.map((g) => (
            <label
              key={g.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                goals.includes(g.id)
                  ? "border-cyan-400/50 bg-cyan-500/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <input
                type="checkbox"
                checked={goals.includes(g.id)}
                onChange={() => toggleGoal(g.id)}
                className="accent-cyan-400"
              />
              <span className="text-sm text-bone">{g.label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-white/80">
            راحتی بودجه
          </legend>
          {BUDGETS.map((b) => (
            <label
              key={b.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                budget === b.id
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <input
                type="radio"
                name="budget"
                checked={budget === b.id}
                onChange={() => setBudget(b.id)}
                className="accent-emerald-400"
              />
              <span className="text-sm text-bone">{b.label}</span>
            </label>
          ))}
        </fieldset>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">یادداشت (اختیاری)</span>
          <textarea
            className="input-field min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="چی اذیتت می‌کنه؟ چی می‌خوای برسه؟"
          />
        </label>

        {error && (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full sm:w-auto">
          دیدن خلاصه و پیشنهاد
        </button>
      </form>
    </div>
  );
}
