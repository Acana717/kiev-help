import { WarningBanner } from "@/components/WarningBanner";
import { HomeHero } from "@/components/HomeHero";
import { FeedList } from "@/components/FeedList";
import { PageShell } from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-10">
        <HomeHero />
        <WarningBanner />
        <section className="border-t border-neutral-800 pt-8">
          <h2 className="font-bebas mb-4 text-xl tracking-wide text-neutral-400">
            ОГОЛОШЕННЯ
          </h2>
          <FeedList />
        </section>
      </div>
    </PageShell>
  );
}
