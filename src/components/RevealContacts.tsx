"use client";

import { useState } from "react";
import type { PostReveal } from "@/lib/types";
import { fetchJson } from "@/lib/fetch-json";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

interface RevealContactsProps {
  postId: string;
  hasPhone: boolean;
  hasTelegram: boolean;
  hasCard: boolean;
  hasJar: boolean;
  bankName: string | null;
}

function ContactsBlock({
  revealed,
  bankName,
}: {
  revealed: PostReveal;
  bankName: string | null;
}) {
  return (
    <div className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-black p-3 text-sm animate-fade-in">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        Контакти та реквізити
      </p>
      {revealed.phone && (
        <p>
          <span className="text-neutral-500">Телефон: </span>
          <a
            href={`tel:${revealed.phone?.replace(/\s/g, "") ?? ""}`}
            className="font-semibold text-[#E5E5E5] contact-mask"
          >
            {revealed.phone}
          </a>
        </p>
      )}
      {revealed.telegram && (
        <p>
          <span className="text-neutral-500">Telegram: </span>
          <a
            href={
              revealed.telegram.startsWith("http")
                ? revealed.telegram
                : `https://t.me/${revealed.telegram.replace(/^@/, "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[#E5E5E5] underline"
          >
            {revealed.telegram}
          </a>
        </p>
      )}
      {revealed.card_number && (
        <p>
          <span className="text-neutral-500">
            Картка{bankName ? ` (${bankName})` : ""}:{" "}
          </span>
          <span className="font-mono font-semibold text-[#E5E5E5] contact-mask select-all">
            {revealed.card_number}
          </span>
        </p>
      )}
      {revealed.jar_link && (
        <p>
          <span className="text-neutral-500">Банка: </span>
          <a
            href={revealed.jar_link}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[#E5E5E5] underline"
          >
            Відкрити посилання
          </a>
        </p>
      )}
    </div>
  );
}

export function RevealContacts({
  postId,
  hasPhone,
  hasTelegram,
  hasCard,
  hasJar,
  bankName,
}: RevealContactsProps) {
  const [revealed, setRevealed] = useState<PostReveal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasAny = hasPhone || hasTelegram || hasCard || hasJar;
  if (!hasAny) return null;

  async function handleReveal() {
    if (revealed) return;
    setLoading(true);
    setError(null);

    const { ok, data, error: err } = await fetchJson<PostReveal>(
      `/api/posts/${postId}/reveal`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );

    if (!ok || !data) {
      setError(err ?? SERVER_UNAVAILABLE_MESSAGE);
    } else if (
      data.phone ||
      data.telegram ||
      data.card_number ||
      data.jar_link
    ) {
      setRevealed(data);
    } else {
      setError(SERVER_UNAVAILABLE_MESSAGE);
    }
    setLoading(false);
  }

  if (revealed) {
    return <ContactsBlock revealed={revealed} bankName={bankName} />;
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleReveal}
        disabled={loading}
        className="w-full rounded-lg border border-neutral-600 bg-black px-3 py-2.5 text-sm font-medium text-[#E5E5E5] transition hover:border-[#E5E5E5] disabled:opacity-50"
      >
        {loading ? "Завантаження…" : "Показати контакти та реквізити"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-1 text-xs text-neutral-600">
        Контакти приховані від автоматичного збору. Відкривайте лише після
        перевірки оголошення.
      </p>
    </div>
  );
}
