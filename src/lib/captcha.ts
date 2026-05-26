import { createHmac, randomInt, timingSafeEqual } from "crypto";

function secret(): string {
  return process.env.REVEAL_SECRET || "dev-secret-change-me";
}

export function createCaptchaChallenge(): {
  a: number;
  b: number;
  token: string;
} {
  const a = randomInt(2, 10);
  const b = randomInt(1, 9);
  const sum = a + b;
  const token = createHmac("sha256", secret())
    .update(`captcha:${sum}`)
    .digest("hex");
  return { a, b, token };
}

export function verifyCaptchaToken(answer: number, token: string): boolean {
  if (!Number.isFinite(answer) || !token) return false;
  const expected = createHmac("sha256", secret())
    .update(`captcha:${answer}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
