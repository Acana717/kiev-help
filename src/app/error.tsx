"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn("[KYIVHELP] app/error:", error.message);
  }, [error]);

  return (
    <div className="rounded-lg border border-neutral-800 bg-[#111111] px-5 py-8 text-center">
      <p className="font-bebas text-xl tracking-wide text-[#E5E5E5]">
        {SERVER_UNAVAILABLE_MESSAGE}
      </p>
      <p className="mt-2 text-sm text-neutral-500">Спробуйте оновити сторінку.</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-neutral-600 px-4 py-2.5 text-sm text-[#E5E5E5]"
        >
          Оновити
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm text-white"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
