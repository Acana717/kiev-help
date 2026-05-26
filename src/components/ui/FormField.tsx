"use client";

import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[#E5E5E5]"
      >
        {label}
        {required && <span className="text-neutral-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function fieldClass(hasError: boolean): string {
  const base =
    "w-full rounded-lg border bg-black px-3.5 py-3 text-base text-[#E5E5E5] placeholder:text-neutral-600 transition focus:outline-none focus:ring-1";
  return hasError
    ? `${base} border-red-900 focus:border-red-700 focus:ring-red-900`
    : `${base} border-neutral-800 focus:border-neutral-600 focus:ring-neutral-700`;
}
