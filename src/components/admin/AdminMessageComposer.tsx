'use client';

import { useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { sendAdminMessageAction } from '@/app/actions/crm';
import { Button } from '@/components/ui/button';

export function AdminMessageComposer({ leadId }: { leadId: string }) {
  const [body, setBody] = useState('');
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    startTransition(async () => {
      const result = await sendAdminMessageAction({ leadId, body: body.trim() });
      if (result.ok) {
        setBody('');
        setSent(true);
        setTimeout(() => setSent(false), 2000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message…"
        className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        disabled={pending}
        maxLength={5000}
      />
      <Button type="submit" size="sm" disabled={pending || !body.trim()}>
        <Send className="h-4 w-4" />
      </Button>
      {sent && (
        <span className="self-center text-xs text-green-600">Sent!</span>
      )}
    </form>
  );
}
