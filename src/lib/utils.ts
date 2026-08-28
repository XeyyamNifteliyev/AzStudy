import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Locale or currency not supported by this runtime's Intl — fall back to 'en'.
    try {
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  }
}

export function formatNumber(value: number, locale: string = 'en'): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    // Locale not supported by this runtime's Intl — fall back to 'en'.
    return new Intl.NumberFormat('en').format(value);
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
