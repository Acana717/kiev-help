export type DescriptionPart =
  | { type: "text"; value: string }
  | { type: "link"; href: string; label: string };

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

const BLOCKED_TLD_SUFFIXES = [".ru", ".su"] as const;

const SCAM_HOSTS = [
  "login-verify.ru",
  "secure-update.ru",
  "bank-support.su",
] as const;

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".vbs",
  ".scr",
  ".cmd",
  ".msi",
  ".ps1",
  ".dll",
] as const;

function splitTrailingPunctuation(raw: string): { url: string; trailing: string } {
  let url = raw;
  let trailing = "";

  while (url.length > 0 && /[)\].,!?;:]$/.test(url)) {
    trailing = url.slice(-1) + trailing;
    url = url.slice(0, -1);
  }

  return { url, trailing };
}

function normalizeHttpUrl(raw: string): string | null {
  const { url } = splitTrailingPunctuation(raw.trim());
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function extractHttpUrls(text: string): string[] {
  const matches = text.match(URL_REGEX) ?? [];
  const urls: string[] = [];

  for (const match of matches) {
    const normalized = normalizeHttpUrl(match);
    if (normalized) urls.push(normalized);
  }

  return urls;
}

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isBlockedTld(hostname: string): boolean {
  return BLOCKED_TLD_SUFFIXES.some(
    (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix)
  );
}

function isScamHost(hostname: string): boolean {
  return SCAM_HOSTS.some(
    (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`)
  );
}

export function hasDangerousDownloadExtension(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return DANGEROUS_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/** Перевірка посилань у тексті опису перед збереженням. */
export function validateDescriptionLinks(text: string): string | null {
  const urls = extractHttpUrls(text);

  for (const url of urls) {
    if (hasDangerousDownloadExtension(url)) {
      return "Посилання містить потенційно небезпечний файл для завантаження";
    }

    const hostname = hostnameOf(url);
    if (!hostname) continue;

    if (isBlockedTld(hostname)) {
      return "Посилання веде на заборонений домен (.ru / .su)";
    }

    if (isScamHost(hostname)) {
      return "Посилання веде на заборонений або підозрілий ресурс";
    }
  }

  return null;
}

/** Розбиває опис на текст і безпечні http(s)-посилання для рендеру в React. */
export function parseDescriptionWithLinks(text: string): DescriptionPart[] {
  const parts: DescriptionPart[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const raw = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    const { url, trailing } = splitTrailingPunctuation(raw);
    const href = normalizeHttpUrl(url);

    if (href) {
      parts.push({ type: "link", href, label: url });
      if (trailing) {
        parts.push({ type: "text", value: trailing });
      }
    } else {
      parts.push({ type: "text", value: raw });
    }

    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}
