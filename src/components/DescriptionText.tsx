import {
  parseDescriptionWithLinks,
  type DescriptionPart,
} from "@/lib/description-links";

const linkClassName =
  "break-all text-foreground underline decoration-neutral-600 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-foreground";

interface DescriptionTextProps {
  text: string;
  className?: string;
}

function renderPart(part: DescriptionPart, key: number) {
  if (part.type === "link") {
    return (
      <a
        key={key}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {part.label}
      </a>
    );
  }

  return <span key={key}>{part.value}</span>;
}

export function DescriptionText({ text, className = "" }: DescriptionTextProps) {
  const parts = parseDescriptionWithLinks(text);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {parts.map((part, index) => renderPart(part, index))}
    </div>
  );
}
