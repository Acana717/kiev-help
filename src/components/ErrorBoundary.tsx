"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[KYIVHELP] ErrorBoundary:", error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="rounded-lg border border-neutral-800 bg-[#111111] px-5 py-8 text-center"
          role="alert"
        >
          <p className="font-bebas text-xl tracking-wide text-[#E5E5E5]">
            {this.props.fallbackTitle ?? SERVER_UNAVAILABLE_MESSAGE}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Оновіть сторінку або поверніться на головну.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="rounded-lg border border-neutral-600 bg-black px-4 py-2.5 text-sm text-[#E5E5E5]"
            >
              Спробувати знову
            </button>
            <Link
              href="/"
              className="rounded-lg border border-[#E5E5E5] bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              На головну
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
