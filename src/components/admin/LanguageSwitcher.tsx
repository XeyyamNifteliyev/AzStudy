// src/components/admin/LanguageSwitcher.tsx
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const ADMIN_LOCALE_COOKIE = 'admin_locale';

export async function setAdminLocale(formData: FormData) {
  const locale = formData.get('locale');
  const value = locale === 'en' ? 'en' : 'az';
  const store = await cookies();
  store.set(ADMIN_LOCALE_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath('/admin', 'layout');
}