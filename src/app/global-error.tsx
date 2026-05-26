"use client";

import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-black p-6 font-sans text-[#E5E5E5] antialiased">
        <div className="mx-auto max-w-lg rounded-lg border border-neutral-800 bg-[#111111] p-8 text-center">
          <p className="font-bebas text-2xl tracking-wide">KYIVHELP</p>
          <p className="mt-4 text-sm text-neutral-400">{SERVER_UNAVAILABLE_MESSAGE}</p>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-3 break-all text-xs text-neutral-600">{error.message}</p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-6 border border-[#E5E5E5] px-6 py-3 text-sm uppercase tracking-wider"
          >
            Спробувати знову
          </button>
        </div>
      </body>
    </html>
  );
}
