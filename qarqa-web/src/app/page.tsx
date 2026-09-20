import Link from "next/link";
import { PromoCountdown } from "@/components/PromoCountdown";
import { STAGES } from "@/lib/stages";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 px-6 py-14 sm:px-12">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
          aria-hidden
        />
        <p className="mb-3 text-sm text-violet-300/80">مسیر پرواز · فاز ۱</p>
        <h1 className="mb-4 text-4xl font-black leading-tight text-bone sm:text-5xl">
          این بار کلاغه
          <br />
          <span className="text-iridescent">به خونه‌ش می‌رسه.</span>
        </h1>
        <p className="mb-2 max-w-xl text-lg leading-relaxed text-white/70">
          برندها در ایران تکه‌تکه ساخته می‌شن. قارقا یک مسئول است برای کل برند —
          بدون دویدن دنبال این و اون.
        </p>
        <p className="mb-8 max-w-xl text-sm text-white/45">
          تو با یک نفر قرارداد می‌بندی؛ ما با همه. فکر داخل، اجرا بیرون.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/diagnose" className="btn-primary">
            شروع مسیر پرواز
          </Link>
          <Link href="/packages" className="btn-ghost">
            دیدن بسته‌ها
          </Link>
        </div>
      </section>

      <PromoCountdown />

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "یک مسئول",
            d: "نتیجه با قارقاست — نه پراکنده بین چند فریلنسر.",
          },
          {
            t: "هوش کلاغ",
            d: "مسئله‌های چندمرحله‌ای؛ از هر شاخه بهترینش.",
          },
          {
            t: "رسیدن به خانه",
            d: "هر پروژه به مقصد می‌رسه. کلاغه‌ای که می‌رسه.",
          },
        ].map((c) => (
          <div key={c.t} className="card-surface">
            <h2 className="mb-2 text-lg font-bold text-bone">{c.t}</h2>
            <p className="text-sm leading-relaxed text-white/55">{c.d}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-2xl font-bold text-bone">شش مرحله‌ی پرواز</h2>
        <p className="mb-6 text-sm text-white/50">
          مراحل ۳ تا ۵ بعد از پذیرش قیمت و پرداخت باز می‌شوند.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="mb-1 text-xs text-violet-300/70">
                {s.order}. {s.nameEn}
              </div>
              <div className="font-bold text-bone">{s.nameFa}</div>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {s.blurbFa}
              </p>
              {s.requiresPayment && (
                <span className="mt-2 inline-block text-[10px] text-white/35">
                  نیازمند پرداخت
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface text-center">
        <p className="mb-4 text-white/60">
          آماده‌ای بفهمی برندت کجاست و کجا باید بره؟
        </p>
        <Link href="/diagnose" className="btn-primary">
          برو به تشخیص
        </Link>
      </section>
    </div>
  );
}
