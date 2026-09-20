"use client";

import { STAGES, type StageId } from "@/lib/stages";

type Props = {
  unlocked: string[];
  current?: string;
  paid: boolean;
};

export function StagePath({ unlocked, current, paid }: Props) {
  return (
    <ol className="relative space-y-0">
      {STAGES.map((stage, i) => {
        const isUnlocked =
          unlocked.includes(stage.id) ||
          (!stage.requiresPayment && unlocked.length > 0) ||
          (paid && stage.requiresPayment);
        const active = current === stage.id;
        const locked =
          stage.requiresPayment &&
          !paid &&
          !unlocked.includes(stage.id);

        return (
          <li key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i < STAGES.length - 1 && (
              <span
                className={`absolute end-[1.15rem] top-10 h-[calc(100%-1.5rem)] w-0.5 ${
                  isUnlocked && !locked
                    ? "bg-gradient-to-b from-violet-400 to-cyan-500/40"
                    : "bg-white/10"
                }`}
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/40">
                  مرحله {stage.order}
                </span>
                {active && (
                  <span className="rounded-full bg-violet-500/30 px-2 py-0.5 text-[10px] text-violet-200">
                    الان اینجایی
                  </span>
                )}
                {locked && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
                    قفل — بعد از پرداخت
                  </span>
                )}
                {isUnlocked && !locked && !active && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                    باز
                  </span>
                )}
              </div>
              <h3
                className={`text-lg font-bold ${
                  locked ? "text-white/35" : "text-bone"
                }`}
              >
                {stage.nameFa}
              </h3>
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  locked ? "text-white/25" : "text-white/55"
                }`}
              >
                {stage.blurbFa}
              </p>
            </div>
            <div
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                locked
                  ? "border-white/15 bg-black text-white/30"
                  : active
                    ? "border-transparent bg-gradient-to-br from-cyan-400 via-violet-500 to-emerald-500 text-black shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                    : "border-violet-400/50 bg-black text-violet-200"
              }`}
            >
              {locked ? "🔒" : stage.order}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export type { StageId };
