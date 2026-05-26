import { headers } from "next/headers";
import { createHash } from "crypto";

export async function getClientFingerprint(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const ua = h.get("user-agent") || "unknown";
  const secret = process.env.REVEAL_SECRET || "dev-secret";
  return createHash("sha256").update(`${ip}:${ua}:${secret}`).digest("hex");
}
