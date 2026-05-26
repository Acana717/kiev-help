"use client";

import { HELP_CATEGORIES, KYIV_DISTRICTS, POST_TYPES } from "@/lib/constants";
import type { FeedFiltersState } from "@/lib/types";

export type { FeedFiltersState };

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-800 bg-black px-3 py-2.5 text-sm text-[#E5E5E5] placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600";

interface FeedFiltersProps {
  value: FeedFiltersState;
  onChange: (next: FeedFiltersState) => void;
}

export function FeedFilters({ value, onChange }: FeedFiltersProps) {
  const set = (patch: Partial<FeedFiltersState>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-3 rounded-lg border border-neutral-800 bg-[#111111] p-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Пошук
        </span>
        <input
          type="search"
          placeholder="Ключові слова..."
          value={value.q}
          onChange={(e) => set({ q: e.target.value })}
          className={inputClass}
          autoComplete="off"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Тип
          </span>
          <select
            value={value.post_type}
            onChange={(e) => set({ post_type: e.target.value })}
            className={inputClass}
          >
            <option value="">Усі</option>
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Категорія
          </span>
          <select
            value={value.category}
            onChange={(e) => set({ category: e.target.value })}
            className={inputClass}
          >
            <option value="">Усі</option>
            {HELP_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Район
        </span>
        <select
          value={value.district}
          onChange={(e) => set({ district: e.target.value })}
          className={inputClass}
        >
          {KYIV_DISTRICTS.map((d) => (
            <option key={d} value={d === "Увесь Київ" ? "" : d}>
              {d}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
