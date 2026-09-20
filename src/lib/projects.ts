"use client";

import { STAGES, type StageId } from "./stages";
import { saveJourney } from "./storage";

export type StageStatus = "locked" | "open" | "done";

export type Project = {
  id: string;
  nameFa: string;
  nameEn: string;
  packageId: string;
  paid: boolean;
  paidAt?: string;
  paidAmount?: number;
  currentStageId: StageId;
  stageStatus: Record<StageId, StageStatus>;
  notes: Record<StageId, string>;
  createdAt: string;
  updatedAt: string;
};

const PROJECTS_KEY = "qarqa-projects-v1";

export const STAGE_CHECKLISTS: Record<StageId, string[]> = {
  diagnosis: ["پرسشنامه", "گزارش دامنه", "پیشنهاد بسته"],
  root: ["بریف مادر", "جایگاه", "پیام‌ها"],
  flock: ["تعیین خروجی‌ها و زمان‌بندی (فاز۱ خودت)"],
  build: ["اتود لوگو", "پالت", "تایپ", "پیش‌نویس‌ها"],
  qa: ["چک در برابر بریف", "اصلاحات"],
  delivery: ["برندبوک", "فایل‌ها", "جلسه تحویل"],
};

export const MOURI_ID = "mouri";

function emptyNotes(): Record<StageId, string> {
  return {
    diagnosis: "",
    root: "",
    flock: "",
    build: "",
    qa: "",
    delivery: "",
  };
}

function unpaidStageStatus(): Record<StageId, StageStatus> {
  return {
    diagnosis: "open",
    root: "open",
    flock: "locked",
    build: "locked",
    qa: "locked",
    delivery: "locked",
  };
}

function unlockAllKeepingDone(
  prev: Record<StageId, StageStatus>
): Record<StageId, StageStatus> {
  const next = { ...prev };
  for (const s of STAGES) {
    next[s.id] = prev[s.id] === "done" ? "done" : "open";
  }
  return next;
}

export function createMouriSeed(partial?: Partial<Project>): Project {
  const now = new Date().toISOString();
  return {
    id: MOURI_ID,
    nameFa: "موری",
    nameEn: "Mouri",
    packageId: "build-standard",
    paid: false,
    currentStageId: "diagnosis",
    stageStatus: unpaidStageStatus(),
    notes: emptyNotes(),
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

function readAll(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function listProjects(): Project[] {
  return readAll();
}

export function getProject(id: string): Project | undefined {
  return readAll().find((p) => p.id === id);
}

export function saveProject(project: Project): Project {
  const next = { ...project, updatedAt: new Date().toISOString() };
  const all = readAll();
  const idx = all.findIndex((p) => p.id === next.id);
  if (idx >= 0) all[idx] = next;
  else all.push(next);
  writeAll(all);
  return next;
}

/** Ensure Mouri exists (unpaid seed if missing). */
export function startMouri(): Project {
  const existing = getProject(MOURI_ID);
  if (existing) return existing;
  return saveProject(createMouriSeed());
}

/**
 * Unlock all post-payment stages, mark paid, sync journey.
 * Creates project (default Mouri) if missing.
 */
export function unlockAfterPayment(opts: {
  projectId?: string;
  packageId?: string;
  paidAmount?: number;
  paidPackageName?: string;
}): Project {
  const id = opts.projectId || MOURI_ID;
  const now = new Date().toISOString();
  let project = getProject(id);
  if (!project) {
    project = createMouriSeed({
      id,
      packageId: opts.packageId || "build-standard",
      nameFa: id === MOURI_ID ? "موری" : id,
      nameEn: id === MOURI_ID ? "Mouri" : id,
    });
  }

  const stageStatus = unlockAllKeepingDone(project.stageStatus);

  project = saveProject({
    ...project,
    packageId: opts.packageId || project.packageId,
    paid: true,
    paidAt: now,
    paidAmount: opts.paidAmount ?? project.paidAmount,
    currentStageId: "flock",
    stageStatus,
  });

  saveJourney({
    selectedPackageId: project.packageId,
    paid: true,
    paidAt: now,
    paidAmount: project.paidAmount,
    paidPackageName: opts.paidPackageName,
    unlockedStages: STAGES.map((s) => s.id),
    currentStageId: "flock",
  });

  return project;
}

/** Start Mouri as pilot: create, mock-pay, unlock, return project. */
export function startMouriPilot(paidAmount = 35_000_000): Project {
  startMouri();
  return unlockAfterPayment({
    projectId: MOURI_ID,
    packageId: "build-standard",
    paidAmount,
    paidPackageName: "ساخت استاندارد",
  });
}

export function advanceStage(projectId: string): Project | undefined {
  const project = getProject(projectId);
  if (!project) return undefined;

  const current = project.currentStageId;
  const idx = STAGES.findIndex((s) => s.id === current);
  if (idx < 0) return project;

  const status = { ...project.stageStatus, [current]: "done" as StageStatus };

  let nextId: StageId = current;
  if (idx < STAGES.length - 1) {
    const candidate = STAGES[idx + 1].id;
    if (status[candidate] !== "locked") {
      nextId = candidate;
      if (status[nextId] !== "done") status[nextId] = "open";
    }
  }

  return saveProject({
    ...project,
    stageStatus: status,
    currentStageId: nextId,
  });
}

export function setProjectStage(
  projectId: string,
  stageId: StageId
): Project | undefined {
  const project = getProject(projectId);
  if (!project) return undefined;
  if (project.stageStatus[stageId] === "locked") return project;
  return saveProject({ ...project, currentStageId: stageId });
}

export function updateStageNotes(
  projectId: string,
  stageId: StageId,
  notes: string
): Project | undefined {
  const project = getProject(projectId);
  if (!project) return undefined;
  return saveProject({
    ...project,
    notes: { ...project.notes, [stageId]: notes },
  });
}

export function clearProjects(): void {
  localStorage.removeItem(PROJECTS_KEY);
}
