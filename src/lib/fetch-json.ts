import { SERVER_UNAVAILABLE_MESSAGE } from "./messages";

export type FetchJsonResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  degraded?: boolean;
  serviceUnavailable?: boolean;
};

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchJsonResult<T>> {
  try {
    const res = await fetch(input, init);
    const text = await res.text();

    if (!text) {
      if (res.status === 503) {
        return {
          ok: false,
          status: 503,
          data: null,
          error: SERVER_UNAVAILABLE_MESSAGE,
          serviceUnavailable: true,
        };
      }
      return {
        ok: res.ok,
        status: res.status,
        data: null,
        error: res.ok ? undefined : "Порожня відповідь сервера",
        degraded: !res.ok,
      };
    }

    let data: T;
    try {
      data = JSON.parse(text) as T;
    } catch {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: "Некоректна відповідь сервера",
      };
    }

    const degraded =
      typeof data === "object" &&
      data !== null &&
      "degraded" in data &&
      !!(data as { degraded?: boolean }).degraded;

    if (!res.ok) {
      const err =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : res.status === 503
            ? SERVER_UNAVAILABLE_MESSAGE
            : "Помилка запиту";
      return {
        ok: false,
        status: res.status,
        data,
        error: err,
        degraded,
        serviceUnavailable: res.status === 503,
      };
    }

    return { ok: true, status: res.status, data, degraded };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: SERVER_UNAVAILABLE_MESSAGE,
      serviceUnavailable: true,
    };
  }
}
