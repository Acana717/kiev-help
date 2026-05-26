import { NextResponse } from "next/server";
import { SERVER_UNAVAILABLE_MESSAGE } from "./messages";

export function jsonOk<T extends Record<string, unknown>>(body: T) {
  return NextResponse.json(body, { status: 200 });
}

export function jsonPosts(posts: unknown[], degraded = false) {
  return jsonOk({ posts, ...(degraded ? { degraded: true } : {}) });
}

export function jsonUnavailable(message = SERVER_UNAVAILABLE_MESSAGE) {
  return NextResponse.json(
    { error: message, degraded: true },
    { status: 503 }
  );
}

export function jsonBadRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
