import Link from "next/link";

export function HomeHero() {
  return (
    <section className="flex flex-col items-center px-2 py-14 text-center sm:py-20">
      <p className="kh-section-kicker mb-3">Київ · 2026</p>
      <h1 className="font-bebas text-6xl leading-none tracking-wide text-foreground sm:text-7xl md:text-8xl">
        KYIVHELP
      </h1>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-neutral-400">
        Взаємодопомога в Києві — швидко, чесно, без зайвого шуму
      </p>
      <Link href="/new" className="kh-btn-primary mt-12">
        Створити оголошення
      </Link>
    </section>
  );
}
