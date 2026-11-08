# 🛍️ DZ Shop — Clothing Store & Instant Checkout

A modern e-commerce store for a clothing brand, built as an Instagram bio store: customers browse products and complete an order in a few clicks, without creating an account.

Built with **Next.js 15**, **React 19**, **TypeScript**, **PostgreSQL (Neon)** and **Tailwind CSS**.

---

## Features

- 🧥 **Product catalog** — categories, sizes, colors and prices
- 🛒 **Cart & instant checkout** — name, phone, wilaya and delivery address
- 🇩🇿 **Algerian wilayas** — delivery pricing per wilaya
- 📦 **Order management** — orders stored in PostgreSQL
- 🔔 **Notifications** — order alerts by email (Nodemailer) and Telegram
- 🔐 **Protected admin area** — secured dashboard route
- 🌍 **Internationalization** — Arabic / French ready (`i18n.ts`)
- 🛡️ **Rate limiting** and input validation on API routes
- 📱 **Responsive design** — mobile-first storefront
- 🔎 **SEO** — metadata, `robots.ts` and `sitemap.ts`

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, tailwind-merge, clsx |
| Database | PostgreSQL (Neon serverless driver) |
| Email | Nodemailer |
| Icons / UI | lucide-react, canvas-confetti |
| Tooling | ESLint, PostCSS, Autoprefixer |

---

## Project structure

```
src/
├── app/                  # App Router pages and API routes
│   ├── products/
│   ├── checkout/
│   ├── api/
│   └── axb-system-auth-9x2f/   # protected admin area
├── components/           # UI components
├── data/                 # products, store config, wilayas
└── lib/                  # auth, db, email, i18n, logger, rate limit
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or [Neon](https://neon.tech))

### Installation

```bash
git clone https://github.com/am4iir/dzshoop.git
cd dzshoop
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_SECRET=replace-me-with-a-long-random-secret
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@example.com
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build

```bash
npm run build
npm start
```

---

## Roadmap

- [ ] Product image uploads
- [ ] Online payment (Stripe / Chargily)
- [ ] Order tracking page for customers
- [ ] Analytics dashboard
- [ ] Automated tests

---

## License

MIT — see the [LICENSE](LICENSE) file.
