# قارقا / Qarqa — مسیر پرواز (MVP)

Persian-first game-like branding journey for **قارقا (Qarqa)**.

فاز ۱: بنیان‌گذار همه‌ی کار را خودش انجام می‌دهد — بدون بازار فریلنسری داخل اپ. اپ = مسیر مشتری + قیمت‌گذاری + پیشرفت.

---

## فارسی

### چی می‌سازه؟

مشتری در «مسیر پرواز» از شش مرحله رد می‌شود:

1. تشخیص → 2. ریشه → 3. چیدن دسته → 4. ساخت → 5. کنترل کیفیت → 6. تحویل

وسط مسیر قیمت ویژه‌ی محدود را می‌پذیرد، پرداخت آزمایشی می‌کند، و بقیه‌ی مراحل باز می‌شوند. وقتی پرومو تمام شود فقط قیمت اصلی نمایش داده می‌شود.

### پنل پروژه‌ها (فاز ۱)

- `/panel` — داشبورد بنیان‌گذار؛ شروع/ادامه موری و پایلوت آزمایشی
- `/panel/projects/[id]` — فضای کار مرحله‌ای با چک‌لیست و یادداشت
- پروژه‌ها در `localStorage` با کلید `qarqa-projects-v1` (`src/lib/projects.ts`)

بعد از پرداخت آزمایشی کاربر به `/panel/projects/mouri` هدایت می‌شود.

### اجرا

```bash
cd /workspace/qarqa-web
npm install
npm run dev
```

ساخت production (webpack):

```bash
npm run build
npm start
```

### پیکربندی قیمت و پرومو

همه‌ی قیمت‌ها و تاریخ پایان پرومو در یک ماژول:

`src/lib/pricing.ts`

ثابت `PROMO_END_ISO` را تغییر بده تا شمارش‌معکوس و نمایش قیمت ویژه/کامل عوض شود.

### پرداخت

صفحهٔ `/payment` پرداخت آزمایشی است (بدون PSP واقعی). رابط برای اتصال بعدی زرین‌پال / آیدی‌پی آماده است. وضعیت در `localStorage` با کلید `qarqa-journey-v1` ذخیره می‌شود.

### پشته

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- فونت Vazirmatn، RTL (`dir="rtl"` / `lang="fa"`)

### هویت بصری

مشکی غالب، تأکید رنگین‌کمانی پر کلاغ، کرم استخوانی. لحن کوتاه و مطمئن فارسی.

---

## English

### What it is

A Phase-1 MVP: client journey through Qarqa’s six-stage flight path, promo vs full pricing with countdown, mock payment, and progress persisted in `localStorage`. No freelancer marketplace — founder does the work.

### Run

```bash
npm install
npm run dev
```

```bash
npm run build && npm start
```

### Config

All toman prices and promo end datetime: **`src/lib/pricing.ts`**.

### Note

Do not push secrets. Mock payment only — wire Zarinpal/IDPay later behind the same payment UI.
