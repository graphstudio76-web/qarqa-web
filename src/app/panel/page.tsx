"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPackageById, formatToman } from "@/lib/pricing";
import {
  listProjects,
  startMouri,
  startMouriPilot,
  type Project,
  MOURI_ID,
} from "@/lib/projects";
import { loadJourney } from "@/lib/storage";
import { STAGES } from "@/lib/stages";

export default function PanelPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setProjects(listProjects());
    setReady(true);
  }, []);

  function refresh() {
    setProjects(listProjects());
  }

  function continueMouri() {
    const p = startMouri();
    refresh();
    router.replace(`/panel/projects/${p.id}`);
  }

  function pilotMouri() {
    setBusy(true);
    try {
      const p = startMouriPilot();
      router.replace(`/panel/projects/${p.id}?paid=1`);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <p className="text-center text-white/50">بارگذاری پنل…</p>;
  }

  const journey = loadJourney();
  const mouri = projects.find((p) => p.id === MOURI_ID);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm text-violet-300/80">فضای کار بنیان‌گذار</p>
        <h1 className="text-3xl font-black text-bone">پنل پروژه‌ها</h1>
        <p className="mt-2 text-sm text-white/55">
          فاز ۱: خودت همه‌ی کار را انجام می‌دهی. مراحل را جلو ببر، یادداشت بگذار،
          چک‌لیست را تیک بزن.
        </p>
      </div>

      <div className="card-surface space-y-4 border-violet-400/30 bg-gradient-to-l from-violet-950/40 to-transparent">
        <h2 className="text-xl font-bold text-bone">موری / Mouri</h2>
        <p className="text-sm text-white/55">
          پروژه‌ی پایلوت — بسته‌ی ساخت استاندارد. حتی بدون تشخیص می‌توانی شروع
          کنی.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={continueMouri}
            disabled={busy}
          >
            {mouri?.paid ? "ادامه موری" : "شروع / ادامه موری"}
          </button>
          {(!mouri || !mouri.paid) && (
            <button
              type="button"
              className="btn-ghost"
              onClick={pilotMouri}
              disabled={busy}
            >
              {busy
                ? "در حال آماده‌سازی…"
                : "شروع پایلوت موری (پرداخت آزمایشی)"}
            </button>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-bone">پروژه‌های تو</h2>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/45">
            هنوز پروژه‌ای نیست. از دکمه‌ی بالا موری را شروع کن، یا از مسیر تشخیص
            برو.
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/diagnose" className="btn-ghost !py-2 text-xs">
                شروع مسیر تشخیص
              </Link>
              {!journey.paid && (
                <Link href="/packages" className="btn-ghost !py-2 text-xs">
                  دیدن بسته‌ها
                </Link>
              )}
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => {
              const pkg = getPackageById(p.packageId);
              const stage = STAGES.find((s) => s.id === p.currentStageId);
              const doneCount = Object.values(p.stageStatus).filter(
                (s) => s === "done"
              ).length;
              return (
                <li key={p.id}>
                  <Link
                    href={`/panel/projects/${p.id}`}
                    className="card-surface block transition hover:border-violet-400/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-lg font-bold text-bone">
                          {p.nameFa}
                          <span className="ms-2 text-sm font-normal text-white/40">
                            {p.nameEn}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          {pkg?.nameFa ?? p.packageId} · مرحله:{" "}
                          {stage?.nameFa ?? p.currentStageId} · {doneCount}/
                          {STAGES.length} انجام‌شده
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] ${
                          p.paid
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-200"
                        }`}
                      >
                        {p.paid
                          ? p.paidAmount != null
                            ? `پرداخت‌شده · ${formatToman(p.paidAmount)}`
                            : "پرداخت‌شده"
                          : "در انتظار پرداخت"}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {!journey.paid && projects.every((p) => !p.paid) && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-950/20 p-4 text-sm text-amber-100/90">
          هنوز پرداخت نکردی. می‌توانی از تشخیص شروع کنی یا پایلوت موری را با
          پرداخت آزمایشی باز کنی.
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/diagnose" className="btn-ghost !py-2 text-xs">
              شروع مسیر
            </Link>
            <Link href="/packages" className="btn-ghost !py-2 text-xs">
              بسته‌ها و پرداخت
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
