import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KYIVHELP — Взаємодопомога",
  description:
    "Платформа взаємодопомоги для жителів Києва: житло, транспорт, медикаменти, фінансова підтримка.",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-black">
        <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-4">
            <Link
              href="/"
              className="font-bebas text-2xl tracking-wide text-[#E5E5E5] hover:text-white"
            >
              KYIVHELP
            </Link>
            <Link
              href="/new"
              className="text-xs font-medium uppercase tracking-widest text-neutral-400 transition hover:text-[#E5E5E5]"
            >
              + Оголошення
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-neutral-800 py-5 text-center text-xs text-neutral-500">
          KYIVHELP · Перевіряйте кожен контакт перед допомогою
        </footer>
      </body>
    </html>
  );
}
