import Link from "next/link";

export function HomeHero() {
  return (
    <section className="flex flex-col items-center px-2 py-12 text-center sm:py-16">
      <h1 className="font-bebas text-6xl leading-none tracking-wide text-[#E5E5E5] sm:text-7xl md:text-8xl">
        KYIVHELP
      </h1>
      <p className="mt-4 max-w-xs text-sm text-neutral-400 sm:text-base">
        Взаємодопомога в Києві
      </p>
      <Link
        href="/new"
        className="mt-10 inline-block border-2 border-[#E5E5E5] bg-black px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#111111] active:scale-[0.98]"
      >
        Створити оголошення
      </Link>
    </section>
  );
}
