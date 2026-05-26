# Windows: якщо `__webpack_modules__[moduleId] is not a function`

## Що видалити (повне очищення кешу)

1. Зупиніть `npm run dev` (Ctrl+C у терміналі).
2. Видаліть у папці проєкту:
   - `.next`
   - `node_modules`
   - `node_modules/.cache` (якщо лишилась)
   - `.turbo` (якщо є)
   - `package-lock.json` (перегенерується)
3. Опційно — кеш npm:
   - `%LocalAppData%\npm-cache`
4. Перевстановлення:

```powershell
cd c:\Users\User\Desktop\kiev-help
npm install
npm run dev
```

## Що змінено в проєкті

- Спрощено `next.config.ts` (без `experimental.optimizePackageImports`).
- Прибрано `framer-motion` (часта причина збоїв webpack + React 19).
- Зафіксовано версії залежностей у `package.json`.
- ESLint через простий `.eslintrc.json`.

## Для деплою на Vercel

У `next.config.ts` можна знову додати `output: "standalone"` лише на production, якщо потрібно.
