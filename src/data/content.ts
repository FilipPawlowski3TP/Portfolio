/**
 * CENTRUM TREŚCI — wszystkie teksty, dane i linki w jednym miejscu.
 *
 * ZASADA: żadnych zmyślonych liczb, metryk ani osiągnięć. Piszemy tylko o tym,
 * co jest prawdą i co da się zweryfikować (jak koparkapawlowski.pl).
 *
 * TODO przed publikacją (wyszukaj „TODO”):
 *  1. site.email / site.phone  → prawdziwe dane kontaktowe
 *  2. site.url                 → docelowa domena portfolio (meta, Schema.org, sitemap)
 *  3. site.socials             → prawdziwe profile
 */

export type HeadingSegment = { text: string; accent?: boolean };

export const site = {
  name: 'Filip',
  monogram: 'F.',
  role: 'Freelance Web Developer',
  email: 'hej@twojadomena.pl', // TODO
  phone: '+48 000 000 000', // TODO
  location: 'Polska · praca zdalna w całym kraju',
  availability: 'Przyjmuję nowe projekty',
  url: 'https://twojadomena.pl', // TODO: docelowa domena portfolio
  socials: [
    { label: 'GitHub', href: 'https://github.com' }, // TODO
    { label: 'LinkedIn', href: 'https://linkedin.com' }, // TODO
  ],
} as const;

export const seo = {
  title: 'Tworzenie stron internetowych dla firm | Filip — Freelance Web Developer',
  description:
    'Projektuję i buduję szybkie, ekskluzywne strony internetowe dla lokalnych firm. Indywidualny design, zero zbędnych wtyczek, realne efekty. Sprawdź case study: koparkapawlowski.pl.',
} as const;

export const navLinks = [
  { label: 'Start', id: 'start' },
  { label: 'Case study', id: 'case-study' },
  { label: 'Przewaga', id: 'przewaga' },
  { label: 'Kontakt', id: 'kontakt' },
] as const;

export const hero = {
  badge: 'Przyjmuję nowe projekty',
  heading: [
    [{ text: 'Strony internetowe,' }],
    [{ text: 'które ' }, { text: 'sprowadzają', accent: true }],
    [{ text: 'klientów do Twojej firmy.' }],
  ] as HeadingSegment[][],
  paragraph:
    'Projektuję i buduję ekskluzywne, błyskawiczne witryny dla lokalnych firm — bez WordPressa, wtyczek i gotowych szablonów. Strona, która ładuje się w mgnieniu oka, wygląda lepiej niż konkurencja i zamienia odwiedzających w klientów.',
  ctas: [
    { label: 'Umów bezpłatną konsultację', target: 'kontakt', variant: 'primary' },
    { label: 'Zobacz case study', target: 'case-study', variant: 'ghost' },
  ],
  scrollHint: 'Przewiń',
} as const;

/**
 * Featured Case Study — jedyny, 100% prawdziwy projekt.
 * Wszystko poniżej odzwierciedla realną stronę koparkapawlowski.pl.
 */
export const caseStudy = {
  label: 'Featured Case Study',
  domain: 'koparkapawlowski.pl',
  href: 'https://koparkapawlowski.pl',
  title: 'Koparki Pawłowski',
  subtitle: 'Jak profesjonalna strona buduje przewagę lokalnej firmy budowlanej',
  narrative:
    'Firma świadcząca usługi minikoparką we Wrocławiu potrzebowała strony, która od pierwszej sekundy wygląda profesjonalnie i prowadzi klienta prosto do telefonu. Zamiast kolejnego szablonu z internetu — indywidualny projekt, treść zaprojektowana pod wyszukiwanie lokalne i prawdziwe zdjęcia z robót, które budują zaufanie lepiej niż jakiekolwiek obietnice.',
  meta: [
    { label: 'Branża', value: 'Usługi budowlane — minikoparka' },
    { label: 'Lokalizacja', value: 'Wrocław i okolice' },
    { label: 'Zakres', value: 'Projekt, kod, wdrożenie' },
    { label: 'Cel', value: 'Kontakt telefoniczny i widoczność lokalna' },
  ],
  screens: [
    {
      image: '/images/kp-home.png',
      caption: 'Hero z jasną obietnicą',
      note: 'Nazwa usługi, obszar działania i telefon widoczne od pierwszego ekranu — klient wie, że trafił dobrze.',
    },
    {
      image: '/images/kp-uslugi.png',
      caption: 'Usługi pod wyszukiwanie lokalne',
      note: 'Osobne podstrony pod konkretne frazy: kopanie fundamentów, wykopy pod instalacje, korytowanie, niwelacja.',
    },
    {
      image: '/images/kp-usluga-szczegoly.png',
      caption: 'Konkret zamiast ogólników',
      note: 'Każda usługa opisana tak, jak szukają jej klienci — z zakresem prac i jasnym kolejnym krokiem.',
    },
    {
      image: '/images/kp-realizacje.png',
      caption: 'Prawdziwe zdjęcia z robót',
      note: 'Realne realizacje zamiast stockowych obrazków — to buduje zaufanie w branży budowlanej.',
    },
  ],
  outcomes: {
    title: 'Co daje firmie taka strona',
    points: [
      'Profesjonalny pierwszy kontakt — klient widzi realną firmę, zanim podniesie telefon',
      'Widoczność dla fraz lokalnych typu „minikoparka Wrocław”',
      'Telefon i zakres usług zawsze pod ręką — na każdym urządzeniu',
      'Przewaga wizerunkowa nad konkurencją na starych, wolnych szablonach',
    ],
  },
  cta: { label: 'Chcę taką stronę dla swojej firmy', target: 'kontakt' },
} as const;

export const advantage = {
  label: 'Proces i przewaga',
  heading: [
    [{ text: 'Twoja strona może być' }],
    [{ text: 'szybsza i lepsza', accent: true }],
    [{ text: 'niż cała konkurencja.' }],
  ] as HeadingSegment[][],
  lead: 'Większość lokalnych firm siedzi na starych, przeładowanych stronach. Nowoczesny, indywidualnie zbudowany serwis to najkrótsza droga, żeby wyprzedzić ich wizerunkowo — i w wyszukiwarce.',
  comparison: {
    theirs: {
      title: 'Typowa strona na starym WordPressie',
      items: [
        'Dziesiątki wtyczek i page builderów',
        'Wolne ładowanie, zwłaszcza na telefonie',
        'Szablon widziany u setek innych firm',
        'Ryzyko ataków, awarii i kosztownych aktualizacji',
        'Wygląd, który starzeje się z dnia na dzień',
      ],
    },
    ours: {
      title: 'Strona zbudowana przeze mnie',
      items: [
        'Indywidualny projekt pod Twój biznes i klientów',
        'Statyczny, błyskawiczny kod — zero zbędnych wtyczek',
        'Wygląd, którego nie ma nikt inny',
        'Bezpieczeństwo i stabilność bez ciągłych łatek',
        'Łatwa rozbudowa, gdy firma rośnie',
      ],
    },
  },
  processLabel: 'Jak przebiega współpraca',
  process: [
    {
      num: '01',
      title: 'Rozmowa i strategia',
      description: 'Poznaję Twój biznes, klientów i cele. Ustalamy zakres, harmonogram i budżet — konkretnie, bez niedomówień.',
    },
    {
      num: '02',
      title: 'Projekt i prototyp',
      description: 'Przygotowuję kierunek wizualny i klikalny prototyp. Zatwierdzasz wygląd, zanim powstanie pierwsza linijka kodu produkcyjnego.',
    },
    {
      num: '03',
      title: 'Development',
      description: 'Buduję stronę z dbałością o szczegóły: animacje, wydajność, SEO techniczne i działanie na każdym urządzeniu.',
    },
    {
      num: '04',
      title: 'Wdrożenie i opieka',
      description: 'Publikuję stronę, podpinam domenę i analitykę. Potem zostaję w kontakcie — aktualizacje, zmiany i rozwój.',
    },
  ],
} as const;

export const contact = {
  label: 'Kontakt',
  heading: [
    [{ text: 'Porozmawiajmy o stronie,' }],
    [{ text: 'która zarabia', accent: true }],
    [{ text: 'na Twój biznes.' }],
  ] as HeadingSegment[][],
  lead: 'Napisz kilka słów o swojej firmie i tym, co ma osiągnąć strona. Odpowiem w ciągu 24 godzin z konkretnymi pytaniami i propozycją kolejnych kroków.',
  note: 'Pierwsza rozmowa jest bezpłatna i do niczego nie zobowiązuje.',
  // Resend (Cloudflare Pages Function) — formularz wysyła realne maile,
  // a przy braku konfiguracji uczciwie otwiera klienta poczty (mailto).
  endpoint: '/api/contact',
} as const;

export const footer = {
  tagline: 'Projektuję i buduję strony internetowe dla firm, które chcą wyglądać i działać lepiej niż konkurencja.',
  credit: 'Zbudowane z Astro · GSAP · Three.js',
} as const;
