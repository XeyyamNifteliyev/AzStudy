/**
 * Structured logger (QA-1).
 *
 * Emits one JSON line per log call so serverless log drains (Vercel) are
 * grep/parse-friendly. No external service — full APM (Sentry/Datadog) can be
 * wired later by replacing `emit()`. Keeps PII out: callers must pass only
 * non-sensitive context; error objects are serialized to name+message (+stack
 * in non-production).
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.error('lead capture failed', { requestId }, err);
 */

type Level = "error" | "warn" | "info";

export interface LogContext {
  [key: string]: unknown;
}

function serializeError(error: unknown): unknown {
  if (!(error instanceof Error)) return String(error);
  const base: Record<string, unknown> = {
    name: error.name,
    message: error.message,
  };
  if (process.env.NODE_ENV !== "production") base.stack = error.stack;
  return base;
}

function emit(
  level: Level,
  message: string,
  context?: LogContext,
  error?: unknown,
): void {
  const record: Record<string, unknown> = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: "azstudy",
  };
  if (context) Object.assign(record, context);
  if (error !== undefined) record.error = serializeError(error);

  const line = JSON.stringify(record);
  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(line);
  } else if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

export const logger = {
  error(message: string, context?: LogContext, error?: unknown): void {
    emit("error", message, context, error);
  },
  warn(message: string, context?: LogContext): void {
    emit("warn", message, context);
  },
  info(message: string, context?: LogContext): void {
    emit("info", message, context);
  },
};

/**
 * Resolve a request id from incoming headers (so a single request's logs
 * correlate across serverless invocations), falling back to a fresh UUID.
 */
export function requestIdFromHeaders(
  get: (name: string) => string | null,
): string {
  return get("x-request-id") ?? get("x-vercel-id") ?? crypto.randomUUID();
}
