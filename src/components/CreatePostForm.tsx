"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BANKS,
  KYIV_DISTRICTS,
  LISTING_CATEGORIES,
} from "@/lib/constants";
import type { ListingCategory } from "@/lib/types";
import { fetchJson } from "@/lib/fetch-json";
import { SERVER_UNAVAILABLE_MESSAGE } from "@/lib/messages";
import { uploadPostImage } from "@/lib/upload-image";
import { validateDescriptionLinks } from "@/lib/description-links";
import { FormField, fieldClass } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ImageUploadField";

type FieldErrors = {
  title?: string;
  description?: string;
  contact?: string;
  captcha?: string;
  image?: string;
};

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function CreatePostForm() {
  const router = useRouter();
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [category, setCategory] = useState<ListingCategory>("Шукаю допомогу");
  const [district, setDistrict] = useState("Шевченківський");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [jarLink, setJarLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<{ a: number; b: number; token: string }>("/api/captcha").then(
      ({ ok, data }) => {
        if (ok && data) {
          setCaptchaA(data.a);
          setCaptchaB(data.b);
          setCaptchaToken(data.token);
        }
      }
    );
  }, []);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!title.trim() || title.trim().length < 3) {
      next.title = "Вкажіть короткий заголовок (мінімум 3 символи)";
    }
    if (!description.trim() || description.trim().length < 10) {
      next.description = "Опишіть ситуацію детальніше (мінімум 10 символів)";
    } else {
      const linkError = validateDescriptionLinks(description);
      if (linkError) next.description = linkError;
    }
    if (!phone.trim() && !telegram.trim()) {
      next.contact = "Потрібен телефон або Telegram — без цього вас не зможуть знайти";
    }
    const answer = parseInt(captchaInput, 10);
    if (!captchaToken || !Number.isFinite(answer)) {
      next.captcha = "Зачекайте завантаження перевірки або введіть відповідь";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const answer = parseInt(captchaInput, 10);
    setLoading(true);

    let imageUrl: string | undefined;
    if (imageFile) {
      const { url, error: uploadError } = await uploadPostImage(imageFile);
      if (uploadError || !url) {
        setLoading(false);
        setErrors((prev) => ({ ...prev, image: uploadError ?? "Не вдалося завантажити фото" }));
        return;
      }
      imageUrl = url;
    }

    const { ok, error: err } = await fetchJson<{ id: string }>("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        district,
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl,
        phone: phone.trim() || undefined,
        telegram: telegram.trim() || undefined,
        card_number: showPayment
          ? cardNumber.replace(/\s/g, "") || undefined
          : undefined,
        bank_name: showPayment && bankName ? bankName : undefined,
        jar_link: showPayment ? jarLink.trim() || undefined : undefined,
        captcha_answer: answer,
        captcha_token: captchaToken,
      }),
    });

    setLoading(false);

    if (!ok) {
      setError(err ?? SERVER_UNAVAILABLE_MESSAGE);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="animate-form-enter space-y-6 pb-10">
      <section className="kh-card animate-slide-up">
        <h2 className="kh-section-kicker">Крок 1</h2>
        <p className="mt-2 kh-section-title text-xl sm:text-2xl">Деталі оголошення</p>
        <div className="mt-5 space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8 lg:space-y-0">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <FormField label="Категорія" htmlFor="category" required>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ListingCategory)}
                  className={fieldClass(false)}
                >
                  {LISTING_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Район Києва" htmlFor="district" required>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={fieldClass(false)}
                >
                  {KYIV_DISTRICTS.filter((d) => d !== "Увесь Київ").map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Заголовок"
              htmlFor="title"
              required
              error={submitted ? errors.title : undefined}
            >
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Наприклад: потрібен транспорт до лікарні"
                className={fieldClass(!!(submitted && errors.title))}
                aria-invalid={!!(submitted && errors.title)}
              />
            </FormField>

            <FormField
              label="Опис ситуації"
              htmlFor="description"
              required
              error={submitted ? errors.description : undefined}
              hint="Адреса, час, що саме потрібно — чим конкретніше, тим швидше допоможуть"
            >
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder="Опишіть ситуацію простими словами..."
                className={`${fieldClass(!!(submitted && errors.description))} min-h-[120px] resize-y lg:min-h-[160px]`}
                aria-invalid={!!(submitted && errors.description)}
              />
            </FormField>
          </div>

          <FormField label="Фото" htmlFor="image" error={submitted ? errors.image : undefined}>
            <ImageUploadField
              file={imageFile}
              previewUrl={imagePreview}
              disabled={loading}
              onChange={(file, preview) => {
                setImageFile(file);
                setImagePreview(preview);
                if (errors.image) {
                  setErrors((prev) => ({ ...prev, image: undefined }));
                }
              }}
            />
          </FormField>
        </div>
      </section>

      <section
        className="kh-card animate-slide-up"
        style={{ animationDelay: "50ms" }}
      >
        <h2 className="kh-section-kicker">Крок 2</h2>
        <p className="mt-2 kh-section-title text-xl sm:text-2xl">
          Як з вами зв&apos;язатися
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Контакти побачать лише після натискання «Показати контакти» у стрічці
        </p>
        <div className="mt-5 space-y-5">
          <FormField
            label="Телефон"
            htmlFor="phone"
            error={submitted ? errors.contact : undefined}
            hint="Або вкажіть Telegram нижче"
          >
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380 XX XXX XX XX"
              autoComplete="tel"
              className={fieldClass(!!(submitted && errors.contact))}
              aria-invalid={!!(submitted && errors.contact)}
            />
          </FormField>
          <FormField label="Telegram" htmlFor="telegram" hint="@нік або посилання">
            <input
              id="telegram"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
              className={fieldClass(!!(submitted && errors.contact))}
            />
          </FormField>
        </div>
      </section>

      <section
        className="kh-card animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={showPayment}
            onChange={(e) => setShowPayment(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-neutral-600 bg-black text-foreground"
          />
          <span>
            <span className="block text-base text-foreground">
              Додати реквізити для допомоги
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-neutral-500">
              Картка або банка — лише якщо потрібні грошові перекази
            </span>
          </span>
        </label>

        {showPayment && (
          <div className="animate-panel-open overflow-hidden">
            <div className="mt-5 space-y-5 rounded-xl border border-neutral-800/90 bg-black p-5">
              <FormField
                label="Номер картки"
                htmlFor="card"
                hint="Без CVV та терміну дії"
              >
                <input
                  id="card"
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="5375 …"
                  className={`${fieldClass(false)} font-mono`}
                />
              </FormField>
              <FormField label="Банк" htmlFor="bank">
                <select
                  id="bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={fieldClass(false)}
                >
                  <option value="">Оберіть банк</option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Посилання на банку" htmlFor="jar">
                <input
                  id="jar"
                  type="url"
                  value={jarLink}
                  onChange={(e) => setJarLink(e.target.value)}
                  placeholder="https://send.monobank.ua/..."
                  className={fieldClass(false)}
                />
              </FormField>
            </div>
          </div>
        )}
      </section>

      <section
        className="kh-card animate-slide-up"
        style={{ animationDelay: "150ms" }}
      >
        <FormField
          label={`Перевірка: скільки буде ${captchaA} + ${captchaB}?`}
          htmlFor="captcha"
          required
          error={submitted ? errors.captcha : undefined}
        >
          <input
            id="captcha"
            type="number"
            inputMode="numeric"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className={fieldClass(!!(submitted && errors.captcha))}
            autoComplete="off"
          />
        </FormField>
      </section>

      {error && (
        <p
          className="kh-card animate-fade-in border-red-900/40 text-sm text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="kh-btn-primary w-full disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner />
            <span>{imageFile ? "Завантажуємо фото…" : "Відправляємо заявку…"}</span>
          </>
        ) : (
          "Опублікувати оголошення"
        )}
      </button>
    </form>
  );
}
