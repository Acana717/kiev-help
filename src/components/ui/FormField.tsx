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
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-neutral-500"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs leading-relaxed text-neutral-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function fieldClass(hasError: boolean): string {
  return hasError ? "kh-input kh-input-error" : "kh-input";
}
