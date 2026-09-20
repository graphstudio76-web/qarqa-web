"use client";

export type DiagnosisAnswers = {
  maturity: string;
  industry: string;
  goals: string[];
  budget: string;
  brandName?: string;
  notes?: string;
};

export type JourneyState = {
  diagnosis?: DiagnosisAnswers;
  recommendedPackageId?: string;
  selectedPackageId?: string;
  paid: boolean;
  paidAt?: string;
  paidAmount?: number;
  paidPackageName?: string;
  unlockedStages: string[];
  currentStageId?: string;
};

const KEY = "qarqa-journey-v1";

export const defaultJourney = (): JourneyState => ({
  paid: false,
  unlockedStages: ["diagnosis", "root"],
  currentStageId: "diagnosis",
});

export function loadJourney(): JourneyState {
  if (typeof window === "undefined") return defaultJourney();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultJourney();
    return { ...defaultJourney(), ...JSON.parse(raw) };
  } catch {
    return defaultJourney();
  }
}

export function saveJourney(partial: Partial<JourneyState>): JourneyState {
  const next = { ...loadJourney(), ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Ensure localStorage write is flushed before navigation. */
export function flushStorage(): void {
  try {
    // Touch a noop read so some browsers settle the write
    void localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
}

export function clearJourney(): void {
  localStorage.removeItem(KEY);
}
