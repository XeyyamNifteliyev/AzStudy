import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getIpFromHeaders } from '@/lib/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';

/**
 * AI chatbot API route — Edge runtime for low latency.
 *
 * Uses OpenAI Chat Completions API (env: OPENAI_API_KEY).
 * The system prompt positions the assistant as a study-in-Azerbaijan guide.
 * If no API key is configured, returns a graceful fallback so the widget
 * degrades cleanly in development / preview environments.
 *
 * Only the 4 GEO locales (en/tr/az/ru) are supported — callers gate the
 * widget with `isGeoLocale()` before sending requests.
 *
 * Security: the `messages` array is validated with Zod (max count, max length,
 * only user/assistant roles) so a client cannot inject a `system` role to
 * override the prompt. Requests are rate-limited per IP to cap OpenAI spend.
 */

export const runtime = 'edge';

// 10 chat requests per minute per IP. The widget sends one request per user
// turn, so this is generous for real users while throttling scripted abuse.
const chatLimiter = rateLimit({ windowMs: 60_000, max: 10 });

const SYSTEM_PROMPTS: Record<string, string> = {
  en: 'You are a helpful assistant for students interested in studying in Azerbaijan. You provide accurate information about Azerbaijani universities, programs, tuition fees, scholarships, visa process, and application steps. Keep answers concise (2-4 sentences). If you don\'t know something specific, direct the student to apply via the website or contact via WhatsApp. Never invent specific tuition numbers — suggest checking the university page.',
  tr: 'Azerbaycan\'da eğitim almak isteyen öğrencilere yardımcı olan bir asistansın. Azerbaycan üniversiteleri, bölümler, ücretler, burslar, vize süreci ve başvuru adımları hakkında doğru bilgi verirsin. Cevapları kısa tut (2-4 cümle). Bilmediğin bir şey olursa öğrenciyi web sitesine veya WhatsApp\'a yönlendir.',
  az: 'Sən Azərbaycanda təhsil almaq istəyən tələbələrə kömək edən bir assistentsən. Azərbaycan universitetləri, proqramlar, təhsil haqqı, təqaüdlər, viza prosesi və müraciət addımları haqqında dəqiq məlumat verirsən. Cavabları qısa tut (2-4 cümlə). Bilmədiyin bir şey olarsa tələbəni veb sayta və ya WhatsApp-a yönləndir.',
  ru: 'Вы помощник для студентов, желающих учиться в Азербайджане. Вы даёте точную информацию об азербайджанских вузах, программах, стоимости, стипендиях, визовом процессе и шагах поступления. Отвечайте кратко (2-4 предложения). Если чего-то не знаете, направьте студента на сайт или в WhatsApp.',
};

// Validate the client payload. Only user/assistant turns are allowed — a
// client-supplied `system` message could override the prompt below, so it is
// rejected. Bounded counts/lengths cap request size and token spend.
const chatSchema = z.object({
  locale: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      }),
    )
    .max(20),
});

export async function POST(req: NextRequest) {
  // Reject cross-origin browser calls (prevents third-party sites from burning
  // the OpenAI budget). Non-browser clients (curl, server-to-server) have no
  // Origin header and pass through.
  if (!isAllowedOrigin(req.headers.get('origin'))) {
    return NextResponse.json(
      { reply: '', error: 'Forbidden' },
      { status: 403 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Graceful fallback when no API key is configured (dev/preview).
    return NextResponse.json({
      reply:
        "I'm currently offline. Please reach out via WhatsApp for instant help with studying in Azerbaijan!",
    });
  }

  // Rate limit before any upstream call to protect the OpenAI budget.
  const ip = getIpFromHeaders((name) => req.headers.get(name));
  if (!(await chatLimiter.check(ip))) {
    return NextResponse.json(
      { reply: '', error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    );
  }

  let payload: z.infer<typeof chatSchema>;
  try {
    const raw = await req.json();
    const parsed = chatSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { reply: '', error: 'Invalid request.' },
        { status: 400 },
      );
    }
    payload = parsed.data;
  } catch {
    return NextResponse.json(
      { reply: '', error: 'Invalid request.' },
      { status: 400 },
    );
  }

  const { messages, locale } = payload;
  const systemPrompt = SYSTEM_PROMPTS[locale ?? 'en'] ?? SYSTEM_PROMPTS.en;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: '', error: 'Failed to get response' },
      { status: 500 },
    );
  }
}
