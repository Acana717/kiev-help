import Link from "next/link";

export function HomeHero() {
  return (
    <section className="flex flex-col items-center px-2 py-14 text-center sm:py-16 lg:items-start lg:px-0 lg:py-12 lg:text-left">
      <p className="kh-section-kicker mb-3">Київ · 2026</p>
      <h1 className="font-bebas text-6xl leading-none tracking-wide text-foreground sm:text-7xl lg:text-8xl">
        KYIVHELP
      </h1>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-neutral-400 lg:max-w-md lg:text-lg">
        Взаємодопомога в Києві — швидко, чесно, без зайвого шуму
      </p>
      <Link href="/new" className="kh-btn-primary mt-10 lg:mt-12">
        Створити оголошення
      </Link>
    </section>
  );
}
