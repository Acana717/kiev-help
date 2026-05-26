"use client";

import { LISTING_CATEGORIES, KYIV_DISTRICTS } from "@/lib/constants";
import type { FeedFiltersState } from "@/lib/types";

export type { FeedFiltersState };

interface FeedFiltersProps {
  value: FeedFiltersState;
  onChange: (next: FeedFiltersState) => void;
  className?: string;
  layout?: "stack" | "sidebar";
}

export function FeedFilters({
  value,
  onChange,
  className = "",
  layout = "stack",
}: FeedFiltersProps) {
  const set = (patch: Partial<FeedFiltersState>) =>
    onChange({ ...value, ...patch });

  const clearAll = () => onChange({ category: "", district: "", q: "" });

  const hasFilters = !!(value.category || value.district || value.q.trim());
  const isSidebar = layout === "sidebar";

  return (
    <div className={`kh-card space-y-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="kh-label">{isSidebar ? "Фільтри" : "Фільтри стрічки"}</p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-neutral-500 transition-colors hover:text-foreground"
          >
            Скинути
          </button>
        )}
      </div>

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

      <div className={`grid gap-4 ${isSidebar ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <label className="block">
          <span className="kh-label">Категорія</span>
          <select
            value={value.category}
            onChange={(e) => set({ category: e.target.value })}
            className="kh-input"
          >
            <option value="">Усі категорії</option>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
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

      <div className={`flex flex-wrap gap-2 ${isSidebar ? "flex-col sm:flex-row lg:flex-col" : ""}`}>
        {LISTING_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => set({ category: value.category === c ? "" : c })}
            className={`rounded-full border px-3 py-1.5 text-left text-xs transition-all duration-200 ${
              isSidebar ? "w-full sm:w-auto lg:w-full" : ""
            } ${
              value.category === c
                ? "border-foreground/40 bg-black text-foreground"
                : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
