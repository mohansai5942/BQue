# BrandiQue Voice AI — Marketing Website

Public marketing site for a business that **creates and sells custom AI voice assistant services** to other businesses. Frontend-only, no build step, deploys to GitHub Pages as-is.

Outpero.com was used **only as inspiration for the product category and customer journey**. All brand, copy, design and code here are original — no Outpero name, logo, text, images or code.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — headline, CTAs, illustrative sample call, services, benefits, use cases, 3-step process, FAQ, final CTA |
| `services.html` | 10 services + honest boundaries |
| `industries.html` | Real estate, clinics, coaching, hospitality, support, local services |
| `how-it-works.html` | 3-step process in detail + what we need from you |
| `pricing.html` | Quote-based tiers (no invented prices) + usage-charges explainer |
| `about.html` | About the business (edit the bio) |
| `contact.html` | Demo-request form (validated, consent checkbox, honest demo notice) + contact cards |
| `privacy.html` / `terms.html` | Editable starter legal text |

## Run locally

```bash
cd voice-ai-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Before publishing — replace these placeholders

**1. `assets/js/config.js`** (single file, site reads it automatically):
- `brandName`, `tagline`, `city`
- `email` — your business email
- `phoneDisplay` / `phoneHref` — your phone number
- `whatsapp` — your WhatsApp number (country code + number, digits only)
- `formServiceConfigured: true` + `formServiceName` — after connecting a form service

**2. Content edits** (search for `EDIT` in the files):
- `about.html` — your bio
- `pricing.html` — tier names/contents (prices intentionally left as "on request")
- `privacy.html` / `terms.html` — replace starter text, set the date

**3. Form submissions.** The demo form currently validates and shows a confirmation **without sending data anywhere** (it says so on the page). To receive enquiries, connect one:
- [Formspree](https://formspree.io) / [Basin](https://usebasin.com) / [Web3Forms](https://web3forms.com) — paste their endpoint into `contact.html`'s form and set `formServiceConfigured: true` in `config.js`.

## Deploy (GitHub Pages)

1. Push this folder's contents to the repo root (or a `docs/` folder).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)` → Save.
3. Live in ~1–2 min at `https://<user>.github.io/<repo>/`.

## Notes

- No invented testimonials, logos, statistics or guarantees anywhere — add real ones when you have them.
- Motion is subtle and disabled under `prefers-reduced-motion`.
- The illustrative sample call on Home is labelled as such; don't present it as a real recording.
