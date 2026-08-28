/**
 * Google Analytics 4 (gtag) global type declarations.
 * Applied automatically by TypeScript since this file is inside `src`.
 */

interface GtagCommand {
  (command: 'event', eventName: string, eventParams?: Record<string, unknown>): void;
  (command: 'config', targetId: string, config?: Record<string, unknown>): void;
  (command: 'js', date: Date): void;
  (command: 'set', config: Record<string, unknown>): void;
}

interface Window {
  gtag?: GtagCommand;
  dataLayer?: unknown[];
}
