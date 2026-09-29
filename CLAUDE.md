# CLAUDE.md

## Архітектура

TrueScale — вебзастосунок для продажу колекційних масштабних моделей авто (1:64), дипломний проєкт на стеку MERN.

- `src/` — фронтенд, React 19 + Vite, Tailwind CSS 4, react-router-dom, i18next (локалізація ua/en), react-three-fiber (3D-конфігуратор моделі), keen-slider, framer-motion.
  - `src/pages/` — сторінки (Checkout, Orders, Cart, каталог, адмінпанель тощо).
  - `src/utils/` — чисті допоміжні функції (`cartStorage.js`, `pricing.js`, `customOrder.js`, `promoValidation.js`).
- `server/` — бекенд, Node.js + Express, MongoDB через Mongoose.
  - `server/models/` — Mongoose-схеми (`User`, `Order`, `Product`, `CustomModel`, `CapsuleModel`, `PromoCode`, `LimitedProduct`, `PasswordResetCode`).
  - `server/routes/` — REST-маршрути (auth, cart, orders, products, promocodes, admin, capsule, customModels, limited, user, passwordReset).
  - `server/middlewares/auth.js` — перевірка JWT (`verifyUser`, `verifyAdmin`).
  - `server/utils/` — надсилання email (nodemailer) і сповіщень у Telegram.
- Інтеграції: Nova Poshta API (доставка), PayPal (оплата), Telegram Bot API та email — сповіщення про замовлення.

## Команди

```bash
npm run dev       # запуск фронтенду (Vite dev-сервер)
npm run build     # збірка фронтенду
npm run lint      # ESLint
npm test          # запуск unit-тестів (vitest run)
```

Бекенд запускається окремо через `node server/server.js` (потребує `.env` зі змінними підключення до MongoDB, JWT-секрету, поштових/Telegram credential).

## Конвенції

- Фронтенд: функціональні React-компоненти, ES-модулі (`"type": "module"` у package.json).
- Бекенд: CommonJS (`require`/`module.exports`) у `server/`.
- Чисті обчислювальні функції (розрахунок кошика, форматування позицій замовлення) виносити в `src/utils/*.js` і покривати тестами vitest (`*.test.js` поруч із модулем) — це спрощує перевірку бізнес-логіки без підняття UI чи бази даних.
- Іменування полів даних кошика/замовлення має бути єдиним у всіх шарах (клієнт → API-запит → Mongoose-схема → email/Telegram-шаблон); перейменування поля в одному місці без оновлення інших — типове джерело неузгодженостей.

## Обмеження

- Не комітити реальні секрети (`.env` вже в `.gitignore` — не читати й не виводити його вміст без потреби).
- Не видаляти чи масово перейменовувати файли в `public/images/**` без явного запиту — це продакшн-контент магазину.
- Зміни в `server/models/*.js` (структура Mongoose-схем) вимагають перевірки всіх місць використання відповідного поля (routes, email/Telegram-шаблони, фронтенд) — саме такий клас дефектів навмисно продемонстровано в `src/utils/customOrder.js` для лабораторної роботи.
