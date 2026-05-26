import Link from "next/link";
import { WarningBanner } from "@/components/WarningBanner";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PageShell } from "@/components/PageShell";

export default function NewPostPage() {
  return (
    <PageShell>
      <div className="space-y-6 pb-6">
        <WarningBanner />
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 transition hover:text-[#E5E5E5]"
        >
          <span aria-hidden>←</span> До головної
        </Link>
        <header className="space-y-1">
          <h1 className="font-bebas text-3xl tracking-wide text-[#E5E5E5]">
            НОВЕ ОГОЛОШЕННЯ
          </h1>
          <p className="text-sm text-neutral-500">
            Заповніть крок за кроком. Перевірте текст перед публікацією.
          </p>
        </header>
        <CreatePostForm />
      </div>
    </PageShell>
  );
}
