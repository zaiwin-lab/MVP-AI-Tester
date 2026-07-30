# KAPT Digital Clinic

**Digital Solution Diagnostic Gateway** — by KAPT, the KOBIS AI Prodigy Team, for KOBIS Berhad.

Organisations do not need to know what system to build. They describe an
operational challenge in their own words; KAPT reviews it and returns an initial
digital diagnosis. This repository contains both halves of that promise:

- a **public diagnostic gateway** (marketing + submission), and
- a **practical internal case-management workspace** for the KAPT team.

> Do not ask us to build software. Tell us what is slowing your organisation
> down. We will help identify the right digital solution.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3, OKLCH design tokens |
| Fonts | Public Sans (UI) + Source Serif 4 (display) via `next/font` |
| Validation | Zod (server-side) |
| Email | Nodemailer (SMTP when configured, log-mode otherwise) |
| Auth | Signed httpOnly session cookies + scrypt password hashing (Node crypto) |
| Data (V1) | Typed, file-backed store behind a repository interface (`src/lib/db.ts`) |
| Data (prod) | `prisma/schema.prisma` documents the PostgreSQL / Supabase upgrade |
| AI assist | Optional Claude API for internal drafts; template fallback |

The V1 data layer uses no native modules or external services, so the whole app
**runs anywhere with `npm install && npm run build`**. Swapping to
Postgres/Supabase means reimplementing `src/lib/db.ts` against the Prisma schema;
nothing else changes.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the app runs without it
npm run dev                  # http://localhost:3000
```

The first visit to `/admin/login` seeds an admin account from `ADMIN_EMAIL` /
`ADMIN_PASSWORD` (defaults in `.env.example`). Public submissions land in the
admin **Cases** pipeline.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

## Configuration

Everything is environment-driven; no secrets live in the code or the client
bundle. See `.env.example` for the full list. With nothing configured:

- **Email** runs in log-mode (messages recorded on the case timeline + console).
- **AI assist** falls back to a structured template draft.
- **Bot protection** uses honeypot + timing + rate-limiting (Turnstile optional).

## Project layout

```
src/
  app/
    (site)/            Public site: home, submit, submitted, demo, legal pages
    admin/
      login/           Team sign-in
      (dash)/          Guarded workspace: overview, cases, content, settings
      print/[id]/      Printable diagnosis (PDF via browser print)
      attachments/     Authenticated file downloads
      actions.ts       Server actions (workflow, diagnosis, email, content)
    api/submit/        Public submission endpoint (validation, uploads, email)
  components/
    home/  form/  site/  admin/  ui/  icons.tsx
  lib/
    domain.ts          Enums + record types (single source of truth)
    db.ts              File-backed persistence (swappable for Prisma)
    cases.ts           Case service layer (audit + history stay consistent)
    content.ts         Editable public copy (client-safe)
    content.server.ts  CMS override loader (server-only)
    email.ts  ai.ts  auth.ts  session.ts  uploads.ts  validation.ts  ...
prisma/schema.prisma   Production Postgres/Supabase schema
docs/DELIVERY.md       Sitemap, journey, architecture, phases, checklists
```

## Governance model (important)

- The public user **never** receives an automated answer. AI may support
  internal analysis only.
- Every AI-generated draft is labelled **“AI-assisted draft · human review
  required”** and is saved as a draft. It is **never** auto-sent.
- Delivering a diagnosis to a client requires an explicit admin action plus a
  confirmation. That is the only path that sends a diagnosis externally.
- Consent text, timestamp, and a one-way hashed submitter fingerprint are
  recorded on every case; all mutations write to an audit log.

## Deployment

Deploys to any Node host or Vercel/Netlify (Next runtime). Before production:

1. Set `SESSION_SECRET`, `ADMIN_*`, and `SMTP_*` in the platform environment.
2. Migrate `src/lib/db.ts` to Postgres/Supabase using `prisma/schema.prisma`,
   and move uploads to object storage (S3 / Supabase Storage).
3. Enable Cloudflare Turnstile and wire the malware-scan hook in
   `src/lib/uploads.ts`.

See `docs/DELIVERY.md` for the full security checklist and phased plan.

---

Brand assets (KOBIS / KAPT logos) and contact details are **editable
placeholders** — replace them before publishing. Nothing in this repository
invents real government partners, logos, testimonials, or statistics.


---

## Portfolio Status & Delivery Role

**Status:** Functional diagnostic-workflow prototype requiring production hardening before handling real organisational submissions.

Product strategy, diagnostic workflow architecture and solution direction are led by **Zaiwin Kassim**, together with the **KOBIS AI Prodigy Team**, using supervised AI-assisted development.

**Security note:** Development credential fallbacks must never be used in a public deployment. Configure strong unique administrator credentials, persistent storage, secure uploads, access logging and a production database before collecting real data.
