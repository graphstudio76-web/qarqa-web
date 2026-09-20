export type StageId =
  | "diagnosis"
  | "root"
  | "flock"
  | "build"
  | "qa"
  | "delivery";

export type Stage = {
  id: StageId;
  order: number;
  nameFa: string;
  nameEn: string;
  blurbFa: string;
  /** Unlocked only after mock payment (milestones 3–5 + delivery) */
  requiresPayment: boolean;
};

export const STAGES: Stage[] = [
  {
    id: "diagnosis",
    order: 1,
    nameFa: "تشخیص",
    nameEn: "Diagnosis",
    blurbFa: "وضعیت برندت را می‌سنجیم؛ گزارش و دامنه مشخص می‌شود.",
    requiresPayment: false,
  },
  {
    id: "root",
    order: 2,
    nameFa: "ریشه",
    nameEn: "Root",
    blurbFa: "استراتژی، جایگاه و بریف مادر شکل می‌گیرد.",
    requiresPayment: false,
  },
  {
    id: "flock",
    order: 3,
    nameFa: "چیدن دسته",
    nameEn: "Assemble flock",
    blurbFa: "تیم مناسب پروژه انتخاب می‌شود — در فاز ۱، خودِ قارقا.",
    requiresPayment: true,
  },
  {
    id: "build",
    order: 4,
    nameFa: "ساخت",
    nameEn: "Build",
    blurbFa: "اسپرینت ساخت با نقطه‌های بازبینی ثابت.",
    requiresPayment: true,
  },
  {
    id: "qa",
    order: 5,
    nameFa: "کنترل کیفیت",
    nameEn: "QA",
    blurbFa: "هر خروجی در برابر بریف مادر چک می‌شود.",
    requiresPayment: true,
  },
  {
    id: "delivery",
    order: 6,
    nameFa: "تحویل",
    nameEn: "Delivery",
    blurbFa: "جلسه‌ی تحویل، ۳۰ روز پشتیبانی، پیشنهاد تولید مستمر.",
    requiresPayment: true,
  },
];
