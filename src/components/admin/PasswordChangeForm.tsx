// src/components/admin/PasswordChangeForm.tsx
'use client';

import { useActionState } from 'react';
import { changePasswordAction } from '@/app/actions/staff-management';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminSession } from '@/lib/crm/session';

export function PasswordChangeForm({ session: _session }: { session: AdminSession }) {
  const [state, formAction, pending] = useActionState<
    { ok: true } | { ok: false; error: string } | null,
    FormData
  >(async (_prev, formData) => {
    return changePasswordAction({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });
  }, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password / Cari parol</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required disabled={pending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password / Yeni parol</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} disabled={pending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password / Yeni parolu təsdiqlə</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={pending} />
      </div>
      {state && !state.ok && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state && state.ok && (
        <p className="text-sm text-green-600">Password changed successfully / Parol uğurla dəyişdirildi</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Changing...' : 'Change password / Parolu dəyiş'}
      </Button>
    </form>
  );
}