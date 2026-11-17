# Portfolio — Freelance Web Developer (Astro 5)

Ekskluzywna „hero page" dla freelancera web developmentu, zbudowana wokół jednego,
100% prawdziwego case study: **koparkapawlowski.pl**. Zero zmyślonych projektów,
metryk i referencji — narracja oparta na realnym wdrożeniu dla lokalnej firmy.

## Stack

| Warstwa        | Narzędzie                                                        |
| -------------- | ---------------------------------------------------------------- |
| Framework      | **Astro 5** (static output, islands architecture)                |
| Wyspy React    | `client:idle` / `client:load` / `client:visible` — JS tylko tam, gdzie trzeba |
| 3D w Hero      | React Three Fiber — wolno obracająca się forma reagująca na mysz  |
| Scroll         | Lenis (inercyjne, „maślane" przewijanie)                         |
| Animacje       | GSAP + ScrollTrigger — **pinned horizontal scroll** w case study, maski typografii (`power4.out`), reveal batching |
| Mikrointerakcje | Magnetic buttons (delegacja zdarzeń, działa też na wyspach)     |
| Style          | Tailwind CSS (tokeny w `tailwind.config.js`)                     |
| Formularz      | React Hook Form + Zod + honeypot → **Resend API** (Cloudflare Pages Function) |
| SEO            | meta tagi, Schema.org `ProfessionalService` (JSON-LD), robots.txt, sitemap.xml |
| Hosting        | Cloudflare Pages (statyczny build + Functions)                   |

## Start deweloperski

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # produkcyjny build do dist/
npm run preview    # podgląd builda produkcyjnego
npm run check      # typecheck (astro check)
```

## Struktura

```
astro.config.mjs           # Astro + integracja React, output: static
public/
  _headers                 # nagłówki bezpieczeństwa + cache (Cloudflare Pages)
  robots.txt, sitemap.xml  # SEO (TODO: podmień domenę)
  images/                  # REALNE screenshoty koparkapawlowski.pl do case study
functions/
  api/contact.ts           # Cloudflare Pages Function → Resend (realne maile)
src/
  data/content.ts          # ⭐ CAŁA TREŚĆ W JEDNYM MIEJSCU (wyszukaj „TODO")
  layouts/Base.astro       # head, meta, fonty, Schema.org JSON-LD, FOUC guard
  pages/index.astro        # kompozycja strony (Hero → Case study → Przewaga → Kontakt)
  scripts/site.ts          # Lenis + GSAP ScrollTrigger + magnetic + drawer
  styles/global.css        # tokeny designu, klasy wspólne, FOUC guard
  islands/
    HeroScene.tsx          # wyspa 3D (R3F) — client:idle
    CaseStudyScroll.tsx    # przypięty poziomy scroll z makiety klienta — client:load
    ContactForm.tsx        # formularz: RHF + Zod + Resend/mailto — client:visible
  components/*.astro       # statyczne sekcje (zero JS poza globalnym skryptem)
```

## Wdrożenie na Cloudflare Pages

1. Repozytorium na GitHub/GitLab → Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Ustawienia builda:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Resend (formularz kontaktowy)** — w *Settings → Environment variables*:
   - `RESEND_API_KEY` — klucz z [resend.com](https://resend.com)
   - `CONTACT_TO_EMAIL` — adres, na który trafiają zapytania
   - `CONTACT_FROM_EMAIL` — nadawca zweryfikowany w Resend (opcjonalnie)
   Katalog `functions/` wdraża się automatycznie jako Pages Functions.
   **Bez tych zmiennych** formularz uczciwie przechodzi w tryb `mailto:` —
   nikt nie traci wiadomości, a sukces nigdy nie jest udawany.

## Kontrola treści (wyszukaj „TODO" w `src/data/content.ts`)

1. `site.email` / `site.phone` — prawdziwe dane kontaktowe.
2. `site.url` — docelowa domena portfolio (meta, canonical, Schema.org, sitemap, robots).
3. `site.socials` — prawdziwe profile.
4. Wszystko o projekcie `koparkapawlowski.pl` jest zgodne z realną stroną
   (opis powstał na podstawie jej faktycznej treści). Jeśli strona klienta
   się zmieni — zaktualizuj opis i screenshoty w `public/images/`.

## Zasady, które są wbudowane w projekt

- **Zero zmyślonych danych** — brak fałszywych metryk, liczb i referencji.
- **Prawdziwe screenshoty** zamiast rysowanych makiet (realne podstrony klienta).
- **Wydajność:** statyczny HTML (LCP = tekst hero), wyspy hydratują się dopiero
  tam, gdzie potrzebny jest JS; `prefers-reduced-motion` wyłącza Lenis, 3D i animacje.
- **SEO techniczne:** poprawna hierarchia H1/H2/H3, meta pod frazę
  „tworzenie stron internetowych dla firm", JSON-LD `ProfessionalService`.
- **Dostępność:** focus states, aria-labels, Escape zamyka drawer, kolor nie jest
  jedynym nośnikiem informacji.
