"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
