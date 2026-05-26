import Link from "next/link";
import { WarningBanner } from "@/components/WarningBanner";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PageShell } from "@/components/PageShell";

export default function NewPostPage() {
  return (
    <PageShell>
      <div className="kh-form-wrap space-y-8 pb-8 sm:space-y-10">
        <WarningBanner />
        <Link href="/" className="kh-link inline-flex items-center gap-1 text-sm">
          <span aria-hidden>←</span> До головної
        </Link>
        <header className="space-y-3">
          <p className="kh-section-kicker">Нове оголошення</p>
          <h1 className="kh-section-title">Заповніть форму</h1>
          <p className="max-w-md text-sm leading-relaxed text-neutral-500 lg:max-w-lg">
            Крок за кроком. Перевірте текст перед публікацією — контакти побачать
            лише за запитом.
          </p>
        </header>
        <CreatePostForm />
      </div>
    </PageShell>
  );
}
