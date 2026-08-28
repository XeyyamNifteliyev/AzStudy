'use client';

import { useEffect } from 'react';

// Catches errors thrown in the ROOT layout (src/app/layout.tsx). The root
// layout — including the next-intl provider and globals.css — is not rendered
// in this state, so we provide our own <html>/<body> and inline styles instead
// of relying on Tailwind or translations. Colors mirror the design tokens
// (primary #003d9b).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f9f9ff',
          color: '#0f172a',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: '0.75rem', maxWidth: '28rem', color: '#475569' }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: '2rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#003d9b',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
