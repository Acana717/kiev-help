import { safeApiHandler } from "@/lib/api-handler";
import { createCaptchaChallenge } from "@/lib/captcha";
import { jsonBadRequest, jsonOk } from "@/lib/api-response";

export async function GET() {
  return safeApiHandler(async () => {
    try {
      const { a, b, token } = createCaptchaChallenge();
      return jsonOk({ a, b, token });
    } catch (error) {
      console.error("[KYIVHELP] captcha error:", error);
      return jsonBadRequest("Не вдалося створити перевірку");
    }
  });
}
