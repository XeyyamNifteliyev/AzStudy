'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadStudentDocument } from '@/app/actions/student';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Application } from '@/types/crm';

export function DocumentUploadForm({ applications }: { applications: Application[] }) {
  const t = useTranslations('Student.documents');
  const [appId, setAppId] = useState(applications[0]?.id ?? '');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0];
    if (!file || !appId) return;
    setStatus('uploading');
    const fd = new FormData();
    fd.set('applicationId', appId);
    fd.set('file', file);
    const res = await uploadStudentDocument(fd);
    setStatus(res.ok ? 'idle' : 'error');
    if (res.ok) form.reset();
  }

  if (applications.length === 0) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Select value={appId} onValueChange={setAppId}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          {applications.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.universityId}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input name="file" type="file" accept="application/pdf,image/png,image/jpeg" required className="block text-sm" />
      {status === 'error' && <p className="text-sm text-destructive">{t('uploadError')}</p>}
      <Button type="submit" disabled={status === 'uploading'}>{t('uploadCta')}</Button>
    </form>
  );
}
