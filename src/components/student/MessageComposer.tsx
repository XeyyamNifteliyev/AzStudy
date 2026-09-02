'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sendStudentMessage } from '@/app/actions/student';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function MessageComposer({ leadId }: { leadId: string }) {
  const t = useTranslations('Student.messages');
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = (e.currentTarget.elements.namedItem('body') as HTMLTextAreaElement).value;
    setSending(true);
    const res = await sendStudentMessage({ leadId, body });
    setSending(false);
    if (res.ok) {
      e.currentTarget.reset();
      // Refresh the server component tree so the new message appears in the
      // thread immediately (no manual reload).
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea name="body" placeholder={t('placeholder')} maxLength={2000} required />
      <Button type="submit" disabled={sending}>{t('send')}</Button>
    </form>
  );
}
