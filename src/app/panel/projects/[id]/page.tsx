"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { StagePath } from "@/components/StagePath";
import { formatToman, getPackageById } from "@/lib/pricing";
import {
  advanceStage,
  getProject,
  MOURI_ID,
  setProjectStage,
  STAGE_CHECKLISTS,
  startMouri,
  startMouriPilot,
  updateStageNotes,
  type Project,
} from "@/lib/projects";
import { STAGES, type StageId } from "@/lib/stages";

function ProjectWorkspaceInner() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const id = String(params.id ?? "");
  const showPaidToast = search.get("paid") === "1";

  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState(showPaidToast);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  const reload = useCallback(() => {
    let p = getProject(id);
    if (!p && id === MOURI_ID) {
      p = startMouri();
    }
    setProject(p ?? null);
    if (p) {
      setNotes(p.notes[p.currentStageId] ?? "");
    }
    setReady(true);
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!showPaidToast) return;
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, [showPaidToast]);

  useEffect(() => {
    if (!project) return;
    setNotes(project.notes[project.currentStageId] ?? "");
    setChecked({});
  }, [project?.currentStageId, project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return <p className="text-center text-white/50">بارگذاری پروژه…</p>;
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-white/60">پروژه پیدا نشد.</p>
        <Link href="/panel" className="btn-primary">
          بازگشت به پنل
        </Link>
      </div>
    );
  }

  const stage =
    STAGES.find((s) => s.id === project.currentStageId) ?? STAGES[0];
  const checklist = STAGE_CHECKLISTS[stage.id] ?? [];
  const pkg = getPackageById(project.packageId);
  const isLast = stage.order === STAGES.length;
  const canAdvance =
    project.stageStatus[stage.id] !== "locked" &&
    (project.paid || !stage.requiresPayment);

  function selectStage(stageId: StageId) {
    const next = setProjectStage(project!.id, stageId);
    if (next) setProject(next);
  }

  function saveNotes() {
    const next = updateStageNotes(project!.id, project!.currentStageId, notes);
    if (next) setProject(next);
  }

  function markDone() {
    saveNotes();
    const next = advanceStage(project!.id);
    if (next) setProject(next);
  }

  function goBackStage() {
    const idx = STAGES.findIndex((s) => s.id === project!.currentStageId);
    if (idx <= 0) {
      router.push("/panel");
      return;
    }
    const prev = STAGES[idx - 1];
    if (project!.stageStatus[prev.id] === "locked") {
      router.push("/panel");
      return;
    }
    selectStage(prev.id);
  }

  function pilotPay() {
    const p = startMouriPilot(project!.paidAmount ?? 35_000_000);
    setProject(p);
    setToast(true);
    router.replace(`/panel/projects/${p.id}?paid=1`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {toast && project.paid && (
        <div
          className="rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-4 text-sm text-emerald-100"
          role="status"
        >
          پرداخت آزمایشی ثبت شد. مسیر پروژه باز است — از پنل مراحل را جلو ببر.
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-sm text-violet-300/80">
            <Link href="/panel" className="hover:text-violet-200">
              پنل
            </Link>{" "}
            / پروژه
          </p>
          <h1 className="text-3xl font-black text-bone">
            {project.nameFa}
            <span className="ms-2 text-lg font-normal text-white/40">
              {project.nameEn}
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {pkg?.nameFa ?? project.packageId}
            {project.paid && project.paidAmount != null
              ? ` · ${formatToman(project.paidAmount)}`
              : ""}
          </p>
        </div>
        <Link href="/panel" className="btn-ghost !py-2 text-xs">
          بازگشت به پنل
        </Link>
      </div>

      {!project.paid && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/30 p-5 space-y-3">
          <p className="text-sm text-amber-100/90">
            این پروژه هنوز پرداخت نشده. مراحل بعد از ریشه قفل‌اند. می‌توانی
            پرداخت کنی یا برای موری پایلوت آزمایشی بزنی.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/payment?package=${project.packageId}&project=${project.id}`}
              className="btn-primary !py-2 text-xs"
            >
              رفتن به پرداخت
            </Link>
            {project.id === MOURI_ID && (
              <button
                type="button"
                className="btn-ghost !py-2 text-xs"
                onClick={pilotPay}
              >
                شروع پایلوت موری (پرداخت آزمایشی)
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h2 className="mb-4 text-lg font-bold text-bone">مسیر مراحل</h2>
          <StagePath
            stageStatus={project.stageStatus}
            current={project.currentStageId}
            paid={project.paid}
            onSelect={selectStage}
          />
        </section>

        <section className="card-surface space-y-5 h-fit sticky top-20">
          <div>
            <p className="text-xs text-violet-300/70">
              مرحله {stage.order} · {stage.nameEn}
            </p>
            <h2 className="text-2xl font-bold text-bone">{stage.nameFa}</h2>
            <p className="mt-1 text-sm text-white/55">{stage.blurbFa}</p>
          </div>

          {project.stageStatus[stage.id] === "locked" ? (
            <p className="text-sm text-white/40">
              این مرحله قفل است. بعد از پرداخت باز می‌شود.
            </p>
          ) : (
            <>
              <div>
                <h3 className="mb-2 text-sm font-bold text-bone">چک‌لیست</h3>
                <ul className="space-y-2">
                  {checklist.map((item) => (
                    <li key={item}>
                      <label className="flex cursor-pointer items-start gap-2 text-sm text-white/75">
                        <input
                          type="checkbox"
                          className="mt-1 accent-violet-500"
                          checked={Boolean(checked[item])}
                          onChange={(e) =>
                            setChecked((c) => ({
                              ...c,
                              [item]: e.target.checked,
                            }))
                          }
                        />
                        <span>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-bone">یادداشت مرحله</span>
                <textarea
                  className="input-field min-h-[120px] resize-y"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={saveNotes}
                  placeholder="یادداشت‌های این مرحله…"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!canAdvance}
                  onClick={markDone}
                >
                  {isLast && project.stageStatus[stage.id] !== "done"
                    ? "مرحله انجام شد ✓"
                    : isLast
                      ? "پروژه در تحویل"
                      : "مرحله انجام شد → بعدی"}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={goBackStage}
                >
                  بازگشت
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProjectWorkspacePage() {
  return (
    <Suspense
      fallback={<p className="text-center text-white/50">بارگذاری…</p>}
    >
      <ProjectWorkspaceInner />
    </Suspense>
  );
}
