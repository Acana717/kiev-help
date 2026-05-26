# Деплой за 60 хвилин (Vercel + Supabase)

## Крок 1 — Supabase (≈15 хв)

1. Відкрийте [supabase.com](https://supabase.com) → **New project** (регіон **Frankfurt** — ближче до Києва).
2. У **SQL Editor** вставте весь вміст файлу `supabase/schema.sql` → **Run**.
3. **Settings → API** скопіюйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**ніколи не публікуйте в клієнті**)
4. Згенеруйте випадковий рядок 32+ символів → `REVEAL_SECRET`.

## Крок 2 — Локальна перевірка (≈10 хв)

```bash
cd kiev-help
cp .env.example .env.local
# заповніть .env.local
npm install
npm run dev
```

Відкрийте `http://localhost:3000` — створіть тестове оголошення, перевірте фільтри та «Показати контакти».

## Крок 3 — GitHub (≈10 хв)

```bash
git init
git add .
git commit -m "Kiev mutual aid MVP"
gh repo create kiev-help --public --source=. --push
```

(або створіть репозиторій вручну на GitHub і `git push`)

## Крок 4 — Vercel (≈15 хв)

1. [vercel.com](https://vercel.com) → **Add New Project** → імпорт репозиторію `kiev-help`.
2. Framework: **Next.js** (автовизначення).
3. **Environment Variables** — додайте всі з `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REVEAL_SECRET`
   - `NEXT_PUBLIC_SITE_URL` = `https://ваш-домен.vercel.app`
4. **Deploy** → дочекайтесь зеленого статусу.

## Крок 5 — Домен і модерація (≈10 хв)

1. Vercel → **Settings → Domains** — підключіть власний домен або використайте `*.vercel.app`.
2. Supabase → **Table Editor → posts** — перевіряйте `report_count`; при ≥5 оголошення ховається автоматично.
3. **Table Editor → reports** — переглядайте скарги (`reason = scam` у пріоритеті).
4. Поширте посилання в Telegram-каналах районів; попросіть волонтерів модерувати скарги кожні 2–3 години.

---

### Чеклист безпеки перед запуском

- [ ] `SUPABASE_SERVICE_ROLE_KEY` лише на Vercel (не в репозиторії)
- [ ] Червоний банер видно на головній
- [ ] Контакти не в HTML до кліку «Показати контакти»
- [ ] Кнопка «Поскаржитися» на кожній картці
- [ ] Ліміт 3 пости/год працює (спробуйте 4-й)

### Після запуску

- Увімкніть **Supabase → Authentication** лише якщо додасте модераторський кабінет.
- Резервне копіювання: Supabase Pro або щоденний експорт таблиць `posts` / `reports`.
