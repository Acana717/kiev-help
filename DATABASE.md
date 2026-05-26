# Структура бази даних — Київ Взаємодопомога

**BaaS:** Supabase (PostgreSQL). Обрано для швидкого RLS, SQL-фільтрів по районах і тригерів модерації.

## Діаграма зв'язків

```
users (1) ──< (N) posts (1) ──< (N) reports
                    │
publish_rate_limits (окремо, по fingerprint)
```

---

## 1. `users` — Користувачі (опційно для MVP)

| Поле | Тип | Опис |
|------|-----|------|
| `id` | UUID PK | Ідентифікатор |
| `display_name` | TEXT | Ім'я для відображення |
| `telegram_nick` | TEXT | Профіль Telegram |
| `created_at` | TIMESTAMPTZ | Дата реєстрації |
| `last_seen_at` | TIMESTAMPTZ | Остання активність |
| `is_banned` | BOOLEAN | Блокування шахраїв |

**MVP:** оголошення можна публікувати без реєстрації (`user_id` = NULL).

---

## 2. `posts` — Заявки / оголошення (ядро)

| Поле | Тип | Опис |
|------|-----|------|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | Опційно |
| `post_type` | ENUM | `need` \| `offer` |
| `category` | ENUM | housing, transport, debris, medicine, finance, other |
| `district` | TEXT | Район Києва |
| `title` | TEXT | 3–120 символів |
| `description` | TEXT | 10–2000 символів |
| `phone_enc` | TEXT | Телефон (**не в стрічці**) |
| `telegram_enc` | TEXT | Telegram (**не в стрічці**) |
| `card_number_enc` | TEXT | Номер картки (**не в стрічці**) |
| `bank_name` | TEXT | Монобанк, ПриватБанк… (публічно, без номера) |
| `jar_link_enc` | TEXT | Посилання на банку (**не в стрічці**) |
| `status` | ENUM | active, fulfilled, hidden, removed |
| `report_count` | INT | Лічильник скарг |
| `client_fingerprint` | TEXT | Анти-спам |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `expires_at` | TIMESTAMPTZ | За замовчуванням +14 днів |

**View `posts_public`:** лише безпечні поля для читання без контактів.

**Індекси:** `created_at DESC`, `district`, `category`, `post_type` (де status = active).

---

## 3. `reports` — Скарги (модерація)

| Поле | Тип | Опис |
|------|-----|------|
| `id` | UUID PK | |
| `post_id` | UUID FK → posts | |
| `reason` | ENUM | scam, spam, fake, duplicate, other |
| `details` | TEXT | До 500 символів |
| `reporter_fingerprint` | TEXT | 1 скарга на оголошення з пристрою |
| `created_at` | TIMESTAMPTZ | |

**Автоматика:** при `report_count >= 5` → `posts.status = hidden`.

---

## 4. `publish_rate_limits` — Анти-спам

| Поле | Тип | Опис |
|------|-----|------|
| `fingerprint` | TEXT PK | Хеш IP + UA + secret |
| `post_count` | INT | Публікацій у вікні |
| `window_start` | TIMESTAMPTZ | Початок годинного вікна |

**Ліміт:** 3 оголошення / година (константа в коді).

---

## Безпека даних

1. **Стрічка** — API `/api/posts` віддає лише `has_phone`, `has_telegram` тощо, без значень.
2. **Reveal** — `/api/posts/[id]/reveal` POST, rate limit 2 с, `Cache-Control: no-store`.
3. **Капча** — проста арифметика на клієнті + перевірка на сервері.
4. **RLS** у Supabase увімкнено; запис через `service_role` у Next.js API routes.

Повний SQL: `supabase/schema.sql`
