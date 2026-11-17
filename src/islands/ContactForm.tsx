import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Send } from 'lucide-react';
import { site } from '../data/content';

const schema = z.object({
  name: z.string().min(2, 'Podaj imię i nazwisko (min. 2 znaki).'),
  email: z.string().email('Podaj poprawny adres e-mail.'),
  company: z.string().max(80).optional(),
  message: z.string().min(20, 'Opisz sprawę w kilku zdaniach (min. 20 znaków).'),
  consent: z.boolean().refine((value) => value === true, {
    message: 'Zgoda jest wymagana, żebym mógł odpowiedzieć na zapytanie.',
  }),
  // honeypot antyspamowy — ludzie go nie widzą, boty wypełniają
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof schema>;
type Status = 'idle' | 'sending' | 'success' | 'mailto';

const inputClass =
  'w-full border border-line bg-white/[0.02] px-5 py-4 text-[0.9375rem] text-ink placeholder:text-muted/50 transition-colors duration-300 focus:border-accent focus:outline-none';

type ContactFormProps = {
  /** Endpoint funkcji serwerowej (Cloudflare Pages Function → Resend) */
  endpoint: string;
};

/**
 * Minimalistyczny formularz kontaktowy:
 *  1. wysyła realny mail przez endpoint serwerowy (Resend),
 *  2. gdy endpoint nie jest skonfigurowany/niedostępny — uczciwie otwiera
 *     klienta poczty z gotową wiadomością (mailto). Nigdy nie udaje sukcesu.
 */
export default function ContactForm({ endpoint }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', company: '', message: '', consent: false, website: '' },
  });

  const openMailto = (values: ContactFormValues) => {
    const subject = encodeURIComponent(`Zapytanie ze strony: ${values.name}`);
    const body = encodeURIComponent(
      `Imię i nazwisko: ${values.name}\nE-mail: ${values.email}\nFirma: ${values.company || '—'}\n\n${values.message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus('mailto');
  };

  const onSubmit = async (values: ContactFormValues) => {
    // honeypot wypełniony → udajemy sukces, nic nie wysyłamy
    if (values.website) {
      setStatus('success');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          message: values.message,
        }),
      });

      if (!response.ok) throw new Error('Endpoint niedostępny');

      setStatus('success');
      reset();
    } catch {
      // Brak skonfigurowanego Resend → realny fallback: gotowa wiadomość w kliencie poczty
      openMailto(values);
    }
  };

  return (
    <>
      {status === 'success' || status === 'mailto' ? (
        <div className="flex flex-col items-start gap-6 border border-line bg-surface/60 p-10">
          <span className="flex h-14 w-14 items-center justify-center border border-accent text-accent">
            <Check className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <h3 className="text-display-s font-medium">
            {status === 'success' ? 'Dziękuję za wiadomość.' : 'Wiadomość jest gotowa do wysłania.'}
          </h3>
          <p className="max-w-md leading-relaxed text-muted">
            {status === 'success'
              ? 'Odebrałem Twoje zapytanie i odpowiem w ciągu 24 godzin. Miłego dnia!'
              : `Otworzył się Twój program poczty z gotową wiadomością — wystarczy ją wysłać. Jeśli nic się nie stało, napisz bezpośrednio na ${site.email}.`}
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            data-magnetic
            onClick={() => {
              setStatus('idle');
              reset();
            }}
          >
            Wyślij kolejną wiadomość
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6 border border-line bg-surface/40 p-7 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <label htmlFor="name" className="label !tracking-[0.16em]">
                Imię i nazwisko *
              </label>
              <input id="name" type="text" autoComplete="name" placeholder="Jan Kowalski" className={inputClass} {...register('name')} />
              {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="label !tracking-[0.16em]">
                E-mail *
              </label>
              <input id="email" type="email" autoComplete="email" placeholder="jan@firma.pl" className={inputClass} {...register('email')} />
              {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="company" className="label !tracking-[0.16em]">
              Firma (opcjonalnie)
            </label>
            <input id="company" type="text" autoComplete="organization" placeholder="Nazwa Twojej firmy" className={inputClass} {...register('company')} />
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="message" className="label !tracking-[0.16em]">
              Wiadomość *
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Opisz krótko swoją firmę i to, co ma osiągnąć strona…"
              className={`${inputClass} resize-y`}
              {...register('message')}
            />
            {errors.message && <span className="text-xs text-danger">{errors.message.message}</span>}
          </div>

          {/* honeypot — ukryty przed ludźmi */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Nie wypełniaj tego pola</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="flex cursor-pointer items-start gap-3.5 text-sm leading-relaxed text-muted">
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" style={{ accentColor: '#D8FF3E' }} {...register('consent')} />
              <span>Wyrażam zgodę na kontakt w sprawie mojego zapytania. Dane wykorzystam wyłącznie do odpowiedzi na tę wiadomość. *</span>
            </label>
            {errors.consent && <span className="text-xs text-danger">{errors.consent.message}</span>}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            data-magnetic
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                Wysyłanie…
              </>
            ) : (
              <>
                Wyślij zapytanie
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </>
            )}
          </button>

          <p className="text-xs leading-relaxed text-muted">
            Pola oznaczone * są wymagane. Nie wysyłam spamu ani nie udostępniam danych osobom trzecim.
          </p>
        </form>
      )}
    </>
  );
}
