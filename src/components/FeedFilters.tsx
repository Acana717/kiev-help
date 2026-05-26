"use client";

import { HELP_CATEGORIES, KYIV_DISTRICTS, POST_TYPES } from "@/lib/constants";
import type { FeedFiltersState } from "@/lib/types";

export type { FeedFiltersState };

interface FeedFiltersProps {
  value: FeedFiltersState;
  onChange: (next: FeedFiltersState) => void;
}

export function FeedFilters({ value, onChange }: FeedFiltersProps) {
  const set = (patch: Partial<FeedFiltersState>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="kh-card space-y-5">
      <label className="block">
        <span className="kh-label">Пошук</span>
        <input
          type="search"
          placeholder="Ключові слова..."
          value={value.q}
          onChange={(e) => set({ q: e.target.value })}
          className="kh-input"
          autoComplete="off"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="kh-label">Тип</span>
          <select
            value={value.post_type}
            onChange={(e) => set({ post_type: e.target.value })}
            className="kh-input"
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
          <span className="kh-label">Категорія</span>
          <select
            value={value.category}
            onChange={(e) => set({ category: e.target.value })}
            className="kh-input"
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
        <span className="kh-label">Район</span>
        <select
          value={value.district}
          onChange={(e) => set({ district: e.target.value })}
          className="kh-input"
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
