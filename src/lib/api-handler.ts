import { jsonUnavailable } from "./api-response";

/** Обгортка для API routes — ніколи не дає необробленому exception стати 500 HTML. */
export async function safeApiHandler(
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    console.error("[KYIVHELP] API error:", error);
    return jsonUnavailable();
  }
}
