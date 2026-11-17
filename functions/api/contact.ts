/**
 * Cloudflare Pages Function: POST /api/contact
 * Wysyła realny e-mail przez Resend (https://resend.com).
 *
 * Konfiguracja w Cloudflare Pages → Settings → Environment variables:
 *   RESEND_API_KEY    — klucz API z panelu Resend (np. re_xxxxxxxxxxxx)
 *   CONTACT_TO_EMAIL  — adres, na który mają trafiać zapytania (np. hej@twojadomena.pl)
 *   CONTACT_FROM_EMAIL— nadawca zweryfikowany w Resend (domyślnie form@resend.dev)
 *
 * Bez tych zmiennych funkcja zwraca 503, a formularz na stronie
 * przechodzi w tryb mailto — użytkownik nigdy nie traci wiadomości.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  website?: string; // honeypot
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function onRequestPost(context: unknown) {
  const { request, env } = context as {
    request: Request;
    env: { RESEND_API_KEY?: string; CONTACT_TO_EMAIL?: string; CONTACT_FROM_EMAIL?: string };
  };

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'Nieprawidłowe żądanie.' }, 400);
  }

  // honeypot wypełniony = bot — udajemy sukces, nic nie wysyłamy
  if (payload.website) return json({ ok: true });

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const message = (payload.message ?? '').trim();

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 20) {
    return json({ ok: false, error: 'Niepełne dane formularza.' }, 422);
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL ?? 'form@resend.dev';

  if (!apiKey || !to) {
    return json({ ok: false, error: 'Formularz nie jest jeszcze skonfigurowany (brak Resend).' }, 503);
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Zapytanie ze strony: ${name}`,
      text: `Imię i nazwisko: ${name}\nE-mail: ${email}\nFirma: ${payload.company || '—'}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    return json({ ok: false, error: 'Nie udało się wysłać wiadomości.' }, 502);
  }

  return json({ ok: true });
}
