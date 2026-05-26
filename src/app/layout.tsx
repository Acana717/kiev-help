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
      <body className="flex min-h-screen flex-col bg-black">
        <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-black/85 backdrop-blur-md">
          <div className="kh-container flex items-center justify-between gap-4 py-4 sm:py-5">
            <Link
              href="/"
              className="font-bebas text-2xl tracking-wide text-foreground transition-colors duration-200 hover:text-white sm:text-3xl lg:text-4xl"
            >
              KYIVHELP
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden rounded-full px-3 py-2 text-xs font-medium text-neutral-500 transition-colors duration-200 hover:text-foreground md:inline-block"
              >
                Стрічка
              </Link>
              <Link
                href="/new"
                className="rounded-full border border-neutral-800 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 transition-all duration-200 hover:border-neutral-600 hover:text-foreground sm:px-5 sm:text-xs"
              >
                + Оголошення
              </Link>
            </nav>
          </div>
        </header>
        <main className="kh-container flex-1 py-8 sm:py-10 lg:py-12">{children}</main>
        <footer className="border-t border-neutral-800/80 py-8 lg:py-10">
          <div className="kh-container flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
            <p className="font-bebas text-sm tracking-[0.2em] text-neutral-600">
              KYIVHELP
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-neutral-500">
              Перевіряйте кожен контакт перед допомогою · Київ · Взаємодопомога
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
