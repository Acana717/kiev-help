"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { MAX_IMAGE_BYTES } from "@/lib/constants";

interface ImageUploadFieldProps {
  file: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  disabled?: boolean;
}

export function ImageUploadField({
  file,
  previewUrl,
  onChange,
  error,
  disabled = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function openFilePicker() {
    if (disabled) return;

    const input = inputRef.current;
    if (!input) {
      console.error("[kiev-help] File input ref is missing");
      return;
    }

    input.value = "";
    input.click();
  }

  function handleFile(next: File | null) {
    setLocalError(null);
    if (!next) {
      onChange(null, null);
      return;
    }

    if (next.size > MAX_IMAGE_BYTES) {
      setLocalError("Максимальний розмір — 5 МБ");
      return;
    }

    if (!next.type.startsWith("image/")) {
      setLocalError("Оберіть файл зображення");
      return;
    }

    const url = URL.createObjectURL(next);
    onChange(next, url);
  }

  function clear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const showError = error ?? localError;
  const pickerClassName = disabled
    ? "pointer-events-none opacity-50"
    : "cursor-pointer transition-all duration-200 hover:border-neutral-500 hover:bg-surface";

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-neutral-800/90">
          <div className="relative aspect-[16/10] w-full bg-black md:aspect-video lg:aspect-square">
            <Image
              src={previewUrl}
              alt="Прев'ю фото"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-neutral-800/90 bg-surface px-4 py-3">
            <span className="truncate text-xs text-neutral-500">
              {file?.name ?? "Фото обрано"}
            </span>
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              className="text-xs text-neutral-400 transition-colors hover:text-foreground disabled:opacity-50"
            >
              Видалити
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
            }
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700/80 bg-black/40 px-6 py-10 text-center lg:min-h-[280px] lg:py-16 ${pickerClassName}`}
        >
          <span className="text-sm font-medium text-foreground">Додати фото</span>
          <span className="text-xs text-neutral-500">JPEG, PNG, WebP · до 5 МБ</span>
        </label>
      )}

      {previewUrl && (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className="kh-link text-xs disabled:opacity-50"
        >
          Замінити фото
        </button>
      )}

      {showError && (
        <p className="text-xs text-red-400" role="alert">
          {showError}
        </p>
      )}
    </div>
  );
}
