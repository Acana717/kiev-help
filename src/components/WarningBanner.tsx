import { WARNING_BANNER } from "@/lib/constants";

export function WarningBanner() {
  return (
    <div
      role="alert"
      className="rounded-lg border border-neutral-800 bg-[#111111] px-4 py-3"
    >
      <p className="font-bebas text-sm tracking-wide text-neutral-400">УВАГА</p>
      <p className="mt-1 text-sm leading-relaxed text-[#E5E5E5]">{WARNING_BANNER}</p>
    </div>
  );
}
