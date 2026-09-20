import type { DiagnosisAnswers } from "./storage";

/**
 * Simple rule-based package recommendation from diagnosis answers.
 */
export function recommendPackageId(answers: DiagnosisAnswers): string {
  const { maturity, goals, budget } = answers;

  if (goals.includes("rebuild") || maturity === "broken") {
    return "rebuild";
  }
  if (goals.includes("upgrade") && maturity !== "none") {
    return "upgrade";
  }

  // Budget comfort drives build tier
  if (budget === "high" || budget === "premium") {
    return "build-full";
  }
  if (budget === "mid") {
    return maturity === "none" || maturity === "early"
      ? "build-standard"
      : "build-standard";
  }
  if (budget === "low") {
    return "build-basic";
  }

  // Default by maturity
  if (maturity === "none") return "build-basic";
  if (maturity === "early") return "build-standard";
  if (maturity === "growing") return "build-full";
  return "build-standard";
}
