import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Screen = { image: string; caption: string; note: string };
type Outcomes = { title: string; points: readonly string[] };
type Cta = { label: string; target: string };

type CaseStudyScrollProps = {
  screens: readonly Screen[];
  outcomes: Outcomes;
  cta: Cta;
};

function BrowserFrame({ image, url }: { image: string; url: string }) {
  return (
    <div className="w-full max-w-5xl overflow-hidden border border-line bg-surface">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto rounded-full border border-line px-5 py-1 text-[0.625rem] tracking-wide text-muted">
          {url}
        </div>
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img src={image} alt={`Podgląd strony ${url}`} className="h-full w-full object-cover object-top" loading="lazy" />
      </div>
    </div>
  );
}

/**
 * Kinowy, przypięty (pinned) poziomy scroll przez realne makiety strony klienta.
 * Desktop (>=1024px): GSAP ScrollTrigger przypina sekcję i przewija track poziomo.
 * Mobile / reduced motion: pionowa lista bez przypięć.
 */
export default function CaseStudyScroll({ screens, outcomes, cta }: CaseStudyScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const track = root.querySelector<HTMLElement>('[data-track]');
        if (!track) return;

        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, root);

    // Po załadowaniu zdjęć makiety zmieniają szerokość tracka — odśwież pozycje triggerów
    const images = Array.from(root.querySelectorAll('img'));
    let pending = images.length;
    const settle = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    images.forEach((img) => {
      if (img.complete) settle();
      else {
        img.addEventListener('load', settle, { once: true });
        img.addEventListener('error', settle, { once: true });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative lg:h-screen lg:overflow-hidden">
      <div data-track className="flex flex-col gap-14 py-10 lg:h-screen lg:w-max lg:flex-row lg:gap-0 lg:py-0">
        {screens.map((screen, index) => (
          <div key={screen.image} className="track-panel">
            <BrowserFrame image={screen.image} url="koparkapawlowski.pl" />
            <div className="mt-8 flex max-w-xl flex-col gap-3">
              <span className="label">
                Ekran 0{index + 1} / 0{screens.length}
              </span>
              <h3 className="text-display-s font-medium">{screen.caption}</h3>
              <p className="text-sm leading-relaxed text-muted">{screen.note}</p>
            </div>
          </div>
        ))}

        {/* Panel zamykający — realne wnioski, bez zmyślonych liczb */}
        <div className="track-panel">
          <div className="flex max-w-xl flex-col gap-8">
            <span className="label !text-accent">Efekt</span>
            <h3 className="text-display-m font-medium">{outcomes.title}</h3>
            <ul className="flex flex-col">
              {outcomes.points.map((point) => (
                <li key={point} className="flex items-start gap-4 border-b border-line py-5 text-base leading-relaxed text-muted last:border-b-0">
                  <span className="mt-3 h-px w-6 shrink-0 bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-primary w-fit" data-magnetic data-scroll-to={cta.target}>
              {cta.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
