# KAPT Digital Clinic — Delivery Blueprint

The twelve planning artifacts requested in the brief, mapped to what shipped.

## 1. Sitemap

```
Public
  /                    Home (hero → magic box → services → approach → receive →
                       how-it-works → expectations → AI ecosystem → experience →
                       trust → FAQ → final CTA)
  /submit              Diagnostic submission form
  /submitted           Confirmation (reference number, next steps)
  /demo                Example diagnoses (sample mode)
  /privacy /terms /consent /disclaimer   Governance pages

Admin (authenticated)
  /admin/login         Team sign-in
  /admin               Overview + analytics
  /admin/cases         Pipeline list (search + status-group filter)
  /admin/cases/[id]    Case detail + diagnosis builder + workflow
  /admin/print/[id]    Printable diagnosis (PDF)
  /admin/content       Content management (hero + copy)
  /admin/settings      Runtime config + team users
  /admin/attachments/* Authenticated file download

API
  POST /api/submit     Public submission (validation, uploads, notifications)
```

## 2. User journey

Visitor lands → understands they only describe a problem → tries the magic box →
opens the form (draft carried over) → fills contact + organisation → describes
the challenge → optional detail + files → consent → submit → confirmation with
reference. Internally: case stored → KAPT notified → admin classifies, assigns,
scores → drafts diagnosis (optionally AI-assisted) → human review → sends by
email → case advances to consultation / pilot / proposal / project.

## 3. Homepage wireframe

Single-page, top-to-bottom, mobile-first. Sticky slim header. Hero with one
primary action. The **central magic box** is the conversion anchor (large open
textarea, rotating examples, optional structuring prompts). Alternating white /
surface bands; two dark institutional bands (expectations, final CTA) for
rhythm. Footer with governance + contact.

## 4. Public page copy

All copy lives in `src/lib/content.ts` (structured, client-safe) so it is
CMS-editable and translation-ready. Admin overrides merge on top via
`content.server.ts`. Legal copy lives in `src/lib/legal.ts`.

## 5. Form structure

Grouped, progressive-disclosure form (`src/components/form/diagnostic-form.tsx`):
1. **Challenge** — title, description (required), category.
2. **About you** — name, position, work email, mobile (required).
3. **Organisation** — name, type (required).
4. **More detail (optional, collapsed)** — department, website, current tools,
   affected users, location, deadline, budget, contact method, language, link.
5. **Files (optional)** + privacy warning.
6. **Consent** (required) + submit.

Server validation in `src/lib/validation.ts` (Zod). Budget never mandatory.

## 6. Admin dashboard architecture

Route-group shell (`/admin/(dash)`) guarded by `requireUser()`; sidebar on
desktop, bottom nav on mobile. Modules: Overview (analytics), Cases (pipeline),
Case detail (challenge, attachments, diagnosis builder, clarification, notes,
timeline; sidebar for workflow, case fields, opportunity score, consent/audit),
Content, Settings. Mutations run through server actions (`admin/actions.ts`)
into the case service layer, keeping status history + audit consistent.

## 7. Database schema

Runtime: typed file-backed store (`src/lib/db.ts`). Production: `prisma/schema.prisma`
— User, Case, Attachment, CaseNote, StatusHistory, EmailLog, CaseScore,
Diagnosis, AuditLog, ContentBlock, Setting. Entities and enums are defined once
in `src/lib/domain.ts`.

## 8. Design system

OKLCH tokens in `tailwind.config.ts`. Deep seal-teal primary (avoids the
generic-corporate-blue the brief warns against), warm sand accent used sparingly,
pure-white surfaces, institutional deep bands. Public Sans + Source Serif 4.
Fluid `clamp()` type scale, semantic status/priority colors, motion with
reduced-motion fallbacks, WCAG-minded contrast.

## 9. Component list

`ui/` button, section, badges. `site/` header, footer, logo, legal-doc.
`home/` hero, magic-box, services, bring-challenge, receive, how-it-works,
expectations, ecosystem, experience, trust, faq, final-cta. `form/`
diagnostic-form. `admin/` sidebar, badges, diagnosis-builder. `icons.tsx`
(single-stroke line set).

## 10. Development phases

- **Phase 1 (shipped):** public site, form, uploads, confirmation, emails,
  admin auth, cases, case detail, diagnosis builder, PDF, analytics, legal,
  security, responsiveness.
- **Phase 2:** Postgres/Supabase, object storage, Turnstile, malware scan,
  richer CMS + multilingual, team-user management UI.
- **Phase 3 (V2 backlog):** client login + case tracking, booking, secure doc
  room, automated scoring, CRM, procurement workflow, white-label.

## 11. Security checklist

- [x] Server-side Zod validation on all submissions
- [x] File type + extension + size validation; non-guessable storage names
- [x] Uploads served only through authenticated route (never public dir)
- [x] Honeypot + submission-timing check + per-IP rate limiting
- [x] Signed httpOnly + sameSite cookies; `Secure` in production
- [x] scrypt password hashing, constant-time compare
- [x] Role field for role-based access; auth guard on every admin surface
- [x] Consent text + timestamp logged; one-way hashed submitter fingerprint
- [x] Audit log on every mutation; submission reference numbers
- [x] Security headers (nosniff, frame, referrer, permissions policy)
- [x] No secrets in the client bundle or code
- [ ] Turnstile, malware scanning, WAF — integration points ready (Phase 2)

## 12. Deployment plan

1. Provision Node host / Vercel / Netlify.
2. Set env: `SESSION_SECRET`, `ADMIN_*`, `SMTP_*`, `MAIL_*`, optional
   `TURNSTILE_*`, `ANTHROPIC_API_KEY`.
3. Migrate data layer to Postgres/Supabase (`prisma migrate`); move uploads to
   object storage.
4. Point DNS, enable HTTPS (session cookie becomes `Secure` automatically).
5. Replace placeholder branding + contact details; review legal copy.
