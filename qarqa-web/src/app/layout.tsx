import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "قارقا | مسیر پرواز برند",
  description:
    "این بار کلاغه به خونه‌ش می‌رسه. خانه‌ی تولید برندِ بدون دیواره — یک مسئول، کلِ برند.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} bg-feather antialiased`}>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
          قارقا — این بار کلاغه به خونه‌ش می‌رسه.
        </footer>
      </body>
    </html>
  );
}
