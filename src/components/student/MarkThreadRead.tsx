'use client';

import { useEffect } from 'react';
import { markThreadReadAction } from '@/app/actions/student';

/**
 * Fires the "thread read" receipt from a client effect once the messages
 * page has mounted. Keeps DB writes out of server rendering (see the
 * messages page — render-time writes can double-fire and violate React
 * purity). Errors are intentionally swallowed: the receipt is best-effort
 * and the page never blocks on it.
 */
export function MarkThreadRead({ leadId }: { leadId: string }) {
  useEffect(() => {
    markThreadReadAction(leadId).catch(() => {});
  }, [leadId]);
  return null;
}
