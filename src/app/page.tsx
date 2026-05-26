import { WarningBanner } from "@/components/WarningBanner";
import { HomeHero } from "@/components/HomeHero";
import { FeedList } from "@/components/FeedList";
import { PageShell } from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-14 sm:space-y-16">
        <HomeHero />
        <WarningBanner />
        <section className="kh-divider pt-10 sm:pt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="kh-section-title">Оголошення</h2>
            <span className="kh-meta hidden sm:inline">Оновлюється в реальному часі</span>
          </div>
          <FeedList />
        </section>
      </div>
    </PageShell>
  );
}
