import { WARNING_BANNER } from "@/lib/constants";

export function WarningBanner() {
  return (
    <div role="alert" className="kh-card border-neutral-800/90 bg-surface-elevated">
      <p className="kh-section-kicker">Увага</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {WARNING_BANNER}
      </p>
    </div>
  );
}
