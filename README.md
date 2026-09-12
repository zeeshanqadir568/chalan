# Chalan

Invoicing and proposals for freelancers and agencies, built around how people
actually get paid in Pakistan — bank transfer, JazzCash, EasyPaisa, or cash.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Prisma 6 + SQLite for local dev (swap the `DATABASE_URL` for Postgres in production)
- Auth.js (next-auth v5) with email/password credentials

## Getting started

```bash
npm install
cp .env.example .env   # then set a real AUTH_SECRET
npx prisma migrate dev
npm run dev
```

The app runs on **http://localhost:3050** (pinned in `package.json` to avoid
clashing with other local projects).

## What's here

- Register/login, clients CRUD
- Invoices and proposals (shared data model, `Document.type`) with line items,
  tax, and PKR/USD currency
- Payment tracking: mark an invoice paid with a method (bank transfer,
  JazzCash, EasyPaisa, cash) and a reference number — no payment gateway
  integration in v1, just clean manual reconciliation
- A public share link per document (`/share/[token]`) with a print/PDF button,
  no login required
- A dashboard with outstanding / paid / overdue totals

## Not yet built

- Editing an existing invoice/proposal (currently create + status-change only)
- Email reminders for due/overdue invoices
- Recurring invoices
- Multi-currency totals on the dashboard (currently assumes one currency)

## Production notes

- Switch `datasource db` in `prisma/schema.prisma` from `sqlite` to
  `postgresql` and point `DATABASE_URL` at a real database (Neon, Supabase,
  etc.) before deploying.
- Set a strong `AUTH_SECRET` and the real `NEXTAUTH_URL` in production env vars.
