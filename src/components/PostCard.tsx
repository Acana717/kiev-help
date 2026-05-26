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
    <article className="kh-card-interactive group flex h-full flex-col overflow-hidden p-0">
      {post.image_url ? (
        <Link href={`/posts/${post.id}`} className="block shrink-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black md:aspect-video lg:aspect-[4/3]">
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col space-y-4 p-5 sm:space-y-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="kh-badge max-w-full truncate">
              {categoryLabel(post.category)}
            </span>
            {post.district && (
              <span className="kh-badge max-w-full truncate border-neutral-700/80 text-neutral-400">
                {post.district}
              </span>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <PostViewsCounter postId={post.id} initialCount={post.views_count} />
            <time className="kh-meta whitespace-nowrap" dateTime={post.created_at}>
              {formatRelativeTime(post.created_at)}
            </time>
          </div>
        </div>

        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="font-bebas text-2xl leading-tight tracking-wide text-foreground transition-colors duration-200 group-hover:text-white lg:text-[1.6rem]">
            {post.title}
          </h2>
        </Link>

        <p className="line-clamp-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300 md:line-clamp-3 lg:line-clamp-4">
          {post.description}
        </p>

        {post.bank_name && (
          <p className="text-xs text-neutral-500">Банк: {post.bank_name}</p>
        )}

        <div className="mt-auto space-y-3 pt-2">
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
