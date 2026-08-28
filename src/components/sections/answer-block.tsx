"use client";

/**
 * AnswerBlock — a prominent "quick answer" box rendered at the top of blog
 * posts and pillar pages. AI systems (Perplexity, ChatGPT, Google AI
 * Overviews) extract the first 40-60 word answer block for citations.
 *
 * The box uses a distinct visual treatment (border-left accent, muted
 * background) so it stands out both to human readers and AI extractors.
 *
 * Speakable schema is NOT added here because it requires server-side JSON-LD
 * injection (see articleJsonLd enhancement). This component handles only the
 * visible on-page answer block.
 */

interface AnswerBlockProps {
  /** The 40-60 word answer text */
  answer: string;
  /** Optional source attribution (e.g. "Source: Ministry of Education, 2026") */
  source?: string;
}

export function AnswerBlock({ answer, source }: AnswerBlockProps) {
  return (
    <div
      className="rounded-lg border-l-4 border-primary bg-primary/5 p-5 mb-8"
      role="region"
      aria-label="Quick answer"
    >
      <p className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">
        Quick Answer
      </p>
      <p className="text-foreground leading-relaxed">{answer}</p>
      {source && (
        <p className="mt-2 text-xs text-muted-foreground italic">{source}</p>
      )}
    </div>
  );
}
