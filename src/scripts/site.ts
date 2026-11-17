/**
 * Globalny skrypt strony: Lenis (smooth scroll) + GSAP ScrollTrigger,
 * animacje wejścia typografii, magnetic buttons, nawigacja i drawer.
 *
 * Zasady:
 *  - animujemy tylko transform/opacity (60 FPS bez klatkowania),
 *  - prefers-reduced-motion wyłącza wszystkie animacje,
 *  - treść nigdy nie zostaje niewidoczna (FOUC guard + wczesne odsłanianie).
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const guardedSelector = '[data-reveal], [data-hero-line], [data-hero-fade], [data-mask-line]';

/* ---------------------------------- Lenis --------------------------------- */

let lenis: Lenis | null = null;

if (!reducedMotion) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* -------------------------- Nawigacja: kotwice + drawer -------------------- */

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -88, duration: 1.25 });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

document.addEventListener('click', (event) => {
  const el = (event.target as Element | null)?.closest<HTMLElement>('[data-scroll-to]');
  if (!el) return;
  event.preventDefault();
  const id = el.dataset.scrollTo;
  if (id) scrollToId(id);
  closeDrawer();
});

const drawer = document.querySelector<HTMLElement>('[data-drawer]');
const drawerOpen = document.querySelector<HTMLElement>('[data-drawer-open]');

function setDrawer(open: boolean): void {
  if (!drawer) return;
  drawer.dataset.open = String(open);
  drawer.setAttribute('aria-hidden', String(!open));
  if (drawerOpen) drawerOpen.setAttribute('aria-expanded', String(open));
  if (lenis) {
    if (open) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = open ? 'hidden' : '';
  drawer.querySelectorAll<HTMLElement>('button, a').forEach((el) => {
    el.tabIndex = open ? 0 : -1;
  });
}

function closeDrawer(): void {
  if (drawer?.dataset.open === 'true') setDrawer(false);
}

drawerOpen?.addEventListener('click', () => setDrawer(true));
document.querySelectorAll<HTMLElement>('[data-drawer-close]').forEach((el) =>
  el.addEventListener('click', () => setDrawer(false)),
);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});

/* ------------------------- Pasek postępu + header -------------------------- */

const progress = document.querySelector<HTMLElement>('[data-progress]');
let ticking = false;

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) {
      const value = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = `scaleX(${value})`;
    }
    const header = document.querySelector<HTMLElement>('[data-header]');
    if (header) header.dataset.scrolled = String(window.scrollY > 24);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --------------------------- Magnetic buttons ----------------------------- */
/* Delegacja na dokumencie — działa też na przyciskach renderowanych przez React
   (wyspy), bez dodatkowych listenerów per element. */

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let last: HTMLElement | null = null;

  document.addEventListener(
    'pointermove',
    (event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-magnetic]') ?? null;

      if (last && last !== target) {
        gsap.to(last, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        last = null;
      }

      if (target) {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.22;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.32;
        gsap.to(target, { x, y, duration: 0.4, ease: 'power3.out' });
        last = target;
      }
    },
    { passive: true },
  );
}

/* --------------------------- Animacje wejścia ----------------------------- */

if (reducedMotion) {
  document.querySelectorAll<HTMLElement>(guardedSelector).forEach((el) => {
    el.style.opacity = '1';
  });
} else {
  gsap.context(() => {
    // Hero — timeline wejściowy (linie maskowane + fade'y)
    const heroLines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
    const heroFades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

    if (heroLines.length) {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(
        heroLines,
        { yPercent: 112, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.12 },
        0.15,
      ).fromTo(
        heroFades,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
        0.8,
      );
    }

    // Sekcje — batch fade-up
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true },
        ),
    });

    // Typografia w maskach — kinowe wejście z power4.out
    ScrollTrigger.batch('[data-mask-line]', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { yPercent: 112, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.12,
            overwrite: true,
          },
        ),
    });

    // Delikatny parallax tła
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((node) => {
      const distance = Number(node.dataset.parallax || 60);
      gsap.fromTo(
        node,
        { y: distance * 0.5 },
        {
          y: -distance * 0.5,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });

  // Zabezpieczenie: gdyby cokolwiek nie odpaliło triggerów, odsłoń treść
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>(guardedSelector).forEach((el) => {
      if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < window.innerHeight) {
        el.style.opacity = '1';
      }
    });
  }, 2500);
}

export {};
