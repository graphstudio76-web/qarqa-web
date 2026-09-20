/**
 * Qarqa pricing & promo config — single source of truth (toman).
 * Promo ends at PROMO_END_ISO; after that only full prices apply.
 */

export const PROMO_END_ISO = "2026-10-04T20:29:59.000Z"; // ~14 days from 2026-09-20 (Asia/Tehran)

export type PriceTier = {
  id: string;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  promo: number | null; // null = range-only or N/A
  full: number | null;
  promoFrom?: number;
  fullFrom?: number;
  fullTo?: number;
  kind: "diagnosis" | "build" | "upgrade" | "rebuild" | "retainer";
  monthly?: boolean;
};

export const PACKAGES: PriceTier[] = [
  {
    id: "diagnosis",
    nameFa: "تشخیص",
    nameEn: "Diagnosis",
    descriptionFa: "پرسشنامه و گزارش تشخیص برند. مبلغ از قرارداد نهایی کم می‌شود.",
    promo: 2_500_000,
    full: 3_500_000,
    kind: "diagnosis",
  },
  {
    id: "build-basic",
    nameFa: "ساخت پایه",
    nameEn: "Build Basic",
    descriptionFa: "هویت پایه: استراتژی کوتاه، لوگو، پالت، تایپ و راهنمای استفاده.",
    promo: 18_000_000,
    full: 22_000_000,
    kind: "build",
  },
  {
    id: "build-standard",
    nameFa: "ساخت استاندارد",
    nameEn: "Build Standard",
    descriptionFa: "ساخت کامل‌تر: بریف مادر، هویت بصری، شبکه‌های اجتماعی و برندبوک سبک.",
    promo: 35_000_000,
    full: 42_000_000,
    kind: "build",
  },
  {
    id: "build-full",
    nameFa: "ساخت کامل",
    nameEn: "Build Full",
    descriptionFa: "از صفر تا تحویل یکپارچه: استراتژی، هویت، محتوا، و بسته‌ی فایل‌ها.",
    promo: 55_000_000,
    full: 68_000_000,
    kind: "build",
  },
  {
    id: "upgrade",
    nameFa: "ارتقا",
    nameEn: "Upgrade",
    descriptionFa: "به‌روزرسانی بدون تغییر هویت اصلی برند.",
    promo: null,
    full: null,
    promoFrom: 12_000_000,
    fullFrom: 14_000_000,
    fullTo: 28_000_000,
    kind: "upgrade",
  },
  {
    id: "rebuild",
    nameFa: "بازسازی",
    nameEn: "Rebuild",
    descriptionFa: "ریبرند کامل با مسئولیت یکپارچه‌ی قارقا.",
    promo: null,
    full: null,
    promoFrom: 40_000_000,
    fullFrom: 48_000_000,
    fullTo: 75_000_000,
    kind: "rebuild",
  },
  {
    id: "retainer-s",
    nameFa: "تولید مستمر — پایه",
    nameEn: "Retainer S",
    descriptionFa: "تولید ماهانه محتوا و نگهداشت برند.",
    promo: 7_000_000,
    full: 9_000_000,
    kind: "retainer",
    monthly: true,
  },
  {
    id: "retainer-m",
    nameFa: "تولید مستمر — استاندارد",
    nameEn: "Retainer M",
    descriptionFa: "حجم متوسط تولید ماهانه با دیده‌بان ثابت.",
    promo: 10_000_000,
    full: 13_000_000,
    kind: "retainer",
    monthly: true,
  },
  {
    id: "retainer-l",
    nameFa: "تولید مستمر — کامل",
    nameEn: "Retainer L",
    descriptionFa: "تولید مستمر پرقدرت برای برندهای فعال.",
    promo: 14_000_000,
    full: 18_000_000,
    kind: "retainer",
    monthly: true,
  },
];

export function isPromoActive(now: Date = new Date()): boolean {
  return now.getTime() < new Date(PROMO_END_ISO).getTime();
}

export function formatToman(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function getDisplayPrice(
  pkg: PriceTier,
  now: Date = new Date()
): {
  label: string;
  amount: number | null;
  crossed?: string;
  isPromo: boolean;
  isFrom: boolean;
} {
  const promoOn = isPromoActive(now);

  if (pkg.promoFrom != null || pkg.fullFrom != null) {
    if (promoOn && pkg.promoFrom != null) {
      return {
        label: "از " + formatToman(pkg.promoFrom),
        amount: pkg.promoFrom,
        crossed:
          pkg.fullFrom != null
            ? "از " +
              formatToman(pkg.fullFrom) +
              (pkg.fullTo != null ? " تا " + formatToman(pkg.fullTo) : "")
            : undefined,
        isPromo: true,
        isFrom: true,
      };
    }
    const from = pkg.fullFrom ?? pkg.promoFrom!;
    const to = pkg.fullTo;
    return {
      label:
        "از " +
        formatToman(from) +
        (to != null ? " تا " + formatToman(to) : ""),
      amount: from,
      isPromo: false,
      isFrom: true,
    };
  }

  if (promoOn && pkg.promo != null) {
    return {
      label: formatToman(pkg.promo) + (pkg.monthly ? " / ماه" : ""),
      amount: pkg.promo,
      crossed:
        pkg.full != null
          ? formatToman(pkg.full) + (pkg.monthly ? " / ماه" : "")
          : undefined,
      isPromo: true,
      isFrom: false,
    };
  }

  const full = pkg.full ?? pkg.promo!;
  return {
    label: formatToman(full) + (pkg.monthly ? " / ماه" : ""),
    amount: full,
    isPromo: false,
    isFrom: false,
  };
}

export function getPayableAmount(pkg: PriceTier, now: Date = new Date()): number {
  const d = getDisplayPrice(pkg, now);
  return d.amount ?? 0;
}

export function getPackageById(id: string): PriceTier | undefined {
  return PACKAGES.find((p) => p.id === id);
}
