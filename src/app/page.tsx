import { Suspense } from "react";
import { WarningBanner } from "@/components/WarningBanner";
import { HomeHero } from "@/components/HomeHero";
import { FeedList } from "@/components/FeedList";
import { PageShell } from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-12 sm:space-y-14 lg:space-y-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12 xl:gap-16">
          <HomeHero />
          <div className="hidden lg:block">
            <WarningBanner />
          </div>
        </div>
        <div className="lg:hidden">
          <WarningBanner />
        </div>
        <section className="kh-divider pt-8 sm:pt-10 lg:pt-12">
          <div className="mb-6 flex items-end justify-between gap-4 lg:mb-8">
            <h2 className="kh-section-title">Оголошення</h2>
            <span className="kh-meta hidden sm:inline">
              Оновлюється в реальному часі
            </span>
          </div>
          <Suspense fallback={null}>
            <FeedList />
          </Suspense>
        </section>
      </div>
    </PageShell>
  );
}
