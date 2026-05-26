"use client";

import { useState } from "react";
import { fetchJson } from "@/lib/fetch-json";

interface ReportButtonProps {
  postId: string;
}

const REASONS = [
  { value: "scam", label: "Шахрайство / збір на чужих фото" },
  { value: "spam", label: "Спам" },
  { value: "fake", label: "Неправдива інформація" },
  { value: "duplicate", label: "Дублікат" },
  { value: "other", label: "Інше" },
] as const;

const darkInput =
  "w-full rounded-lg border border-neutral-800 bg-black px-2 py-1.5 text-xs text-[#E5E5E5]";

export function ReportButton({ postId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("scam");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function submit() {
    setStatus("loading");

    const { ok, error } = await fetchJson<{ ok?: boolean }>("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, reason, details }),
    });

    if (!ok) {
      setStatus("error");
      console.error(error);
      return;
    }
    setStatus("done");
    setOpen(false);
  }

  if (status === "done") {
    return (
      <p className="text-xs text-neutral-500">Дякуємо. Скаргу передано модераторам.</p>
    );
  }

  return (
    <div className="mt-2 border-t border-neutral-800 pt-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-neutral-500 underline hover:text-[#E5E5E5]"
        >
          Поскаржитися
        </button>
      ) : (
        <div className="space-y-2 rounded-lg border border-neutral-800 bg-black p-2">
          <p className="text-xs font-medium text-neutral-400">Скарга на оголошення</p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={darkInput}
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Деталі (необов'язково)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
            className={darkInput}
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={status === "loading"}
              className="rounded-lg border border-neutral-600 px-2 py-1 text-xs font-medium text-[#E5E5E5]"
            >
              Надіслати
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-neutral-500"
            >
              Скасувати
            </button>
          </div>
          {status === "error" && (
            <p className="text-xs text-red-400">Не вдалося надіслати. Спробуйте пізніше.</p>
          )}
        </div>
      )}
    </div>
  );
}
