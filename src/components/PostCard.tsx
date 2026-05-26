import type { PostPublic } from "@/lib/types";
import { categoryLabel, formatRelativeTime, postTypeLabel } from "@/lib/labels";
import { RevealContacts } from "./RevealContacts";
import { ReportButton } from "./ReportButton";

interface PostCardProps {
  post: PostPublic & {
    has_phone?: boolean;
    has_telegram?: boolean;
    has_card?: boolean;
    has_jar?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-lg border border-neutral-800 bg-[#111111] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {postTypeLabel(post.post_type)}
        </span>
        <time className="text-xs text-neutral-500" dateTime={post.created_at}>
          {formatRelativeTime(post.created_at)}
        </time>
      </div>
      <h2 className="mt-3 font-bebas text-xl leading-tight tracking-wide text-[#E5E5E5]">
        {post.title}
      </h2>
      <p className="mt-1 flex flex-wrap gap-2 text-xs text-neutral-500">
        <span>{post.district}</span>
        <span>·</span>
        <span>{categoryLabel(post.category)}</span>
      </p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
        {post.description}
      </p>
      {post.bank_name && (
        <p className="mt-2 text-xs text-neutral-500">Банк: {post.bank_name}</p>
      )}
      <RevealContacts
        postId={post.id}
        hasPhone={!!post.has_phone}
        hasTelegram={!!post.has_telegram}
        hasCard={!!post.has_card}
        hasJar={!!post.has_jar}
        bankName={post.bank_name}
      />
      <ReportButton postId={post.id} />
    </article>
  );
}
