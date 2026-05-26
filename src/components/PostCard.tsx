import Link from "next/link";
import { PostViewsCounter } from "./PostViewsCounter";
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
    <article className="kh-card-interactive group">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="kh-badge">{postTypeLabel(post.post_type)}</span>
        <div className="flex flex-wrap items-center gap-3">
          <PostViewsCounter postId={post.id} initialCount={post.views_count} />
          <time className="kh-meta" dateTime={post.created_at}>
            {formatRelativeTime(post.created_at)}
          </time>
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="mt-4 block">
        <h2 className="font-bebas text-2xl leading-tight tracking-wide text-foreground transition-colors duration-200 group-hover:text-white sm:text-[1.65rem]">
          {post.title}
        </h2>
      </Link>

      <p className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-500">
        <span>{post.district}</span>
        <span aria-hidden>·</span>
        <span>{categoryLabel(post.category)}</span>
      </p>

      <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
        {post.description}
      </p>

      {post.bank_name && (
        <p className="mt-3 text-xs text-neutral-500">Банк: {post.bank_name}</p>
      )}

      <div className="mt-5 space-y-3">
        <Link
          href={`/posts/${post.id}`}
          className="kh-link inline-block text-xs font-medium uppercase tracking-[0.12em]"
        >
          Читати повністю →
        </Link>

        <RevealContacts
          postId={post.id}
          hasPhone={!!post.has_phone}
          hasTelegram={!!post.has_telegram}
          hasCard={!!post.has_card}
          hasJar={!!post.has_jar}
          bankName={post.bank_name}
        />

        <ReportButton postId={post.id} />
      </div>
    </article>
  );
}
