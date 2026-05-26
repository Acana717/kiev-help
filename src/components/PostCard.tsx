"use client";

import Image from "next/image";
import Link from "next/link";
import { PostViewsCounter } from "./PostViewsCounter";
import type { PostPublic } from "@/lib/types";
import { categoryLabel, formatRelativeTime } from "@/lib/labels";
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
    <article className="kh-card-interactive group overflow-hidden p-0">
      {post.image_url && (
        <Link href={`/posts/${post.id}`} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 576px) 100vw, 576px"
            />
          </div>
        </Link>
      )}

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="kh-badge">{categoryLabel(post.category)}</span>
            {post.district && (
              <span className="kh-badge border-neutral-700/80 text-neutral-400">
                {post.district}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PostViewsCounter postId={post.id} initialCount={post.views_count} />
            <time className="kh-meta" dateTime={post.created_at}>
              {formatRelativeTime(post.created_at)}
            </time>
          </div>
        </div>

        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="font-bebas text-2xl leading-tight tracking-wide text-foreground transition-colors duration-200 group-hover:text-white sm:text-[1.65rem]">
            {post.title}
          </h2>
        </Link>

        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
          {post.description}
        </p>

        {post.bank_name && (
          <p className="text-xs text-neutral-500">Банк: {post.bank_name}</p>
        )}

        <div className="space-y-3 pt-1">
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
      </div>
    </article>
  );
}
