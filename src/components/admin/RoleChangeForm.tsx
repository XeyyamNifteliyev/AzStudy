// src/components/admin/RoleChangeForm.tsx
'use client';

import { useActionState } from 'react';
import { updateRoleAction } from '@/app/actions/staff-management';
import type { AdminLocale } from '@/lib/admin-i18n';

export function RoleChangeForm({
  profileId,
  currentRole,
  locale,
}: {
  profileId: string;
  currentRole: 'admin' | 'consultant' | 'editor';
  locale: AdminLocale;
}) {
  const [state, formAction, pending] = useActionState<
    { ok: true } | { ok: false; error: string } | null,
    FormData
  >(async (_prev, formData) => {
    return updateRoleAction({
      profileId: formData.get('profileId'),
      role: formData.get('role'),
    });
  }, null);

  const az = locale === 'az';

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="profileId" value={profileId} />
      <select
        name="role"
        defaultValue={currentRole === 'admin' ? 'admin' : 'consultant'}
        disabled={pending}
        className="rounded border border-border bg-background px-2 py-1 text-xs"
      >
        <option value="admin">{az ? 'Admin' : 'Admin'}</option>
        <option value="consultant">{az ? 'Konsultant' : 'Consultant'}</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? '...' : az ? 'Yadda saxla' : 'Save'}
      </button>
      {state && !state.ok && (
        <span className="text-xs text-destructive">{state.error}</span>
      )}
    </form>
  );
}