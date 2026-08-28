// src/lib/admin-i18n.ts
import { cookies } from 'next/headers';

export type AdminLocale = 'az' | 'en';

export const ADMIN_LOCALES: AdminLocale[] = ['az', 'en'];
const ADMIN_LOCALE_COOKIE = 'admin_locale';

export const ADMIN_TRANSLATIONS = {
  az: {
    'nav.overview': 'Ümumi baxış',
    'nav.applications': 'Müraciətlər',
    'nav.leads': 'Leads (CRM)',
    'nav.users': 'İstifadəçilər',
    'nav.audit': 'Audit jurnalı',
    'nav.settings': 'Tənzimləmələr',
    'topbar.signOut': 'Çıxış',
    'overview.title': 'Ümumi baxış',
    'overview.subtitle': 'Pipeline və son fəaliyyət',
    'overview.totalLeads': ' Ümumi lead',
    'overview.new': 'Yeni',
    'overview.unassigned': 'Təyin edilməmiş',
    'overview.unassigned.hint': 'Konsultant tələb olunur',
    'overview.conversion': 'Konversiya',
    'overview.conversion.hint': 'Tamamlandı / ümumi',
    'overview.pipeline': 'Pipeline',
    'overview.recentActivity': 'Son fəaliyyət',
    'overview.noActivity': 'Hələ fəaliyyət yoxdur',
    'overview.viewApplications': 'Müraciətlərə bax →',
    'applications.title': 'Müraciətlər',
    'applications.subtitle': '{count} tələbə müraciəti · {new} yeni',
    'applications.all': 'Bütün',
    'applications.empty': 'Hələ heç bir müraciət yoxdur',
    'applications.emptyHint': 'Tələbə Apply forması göndərişləri burada görünəcək',
    'applications.student': 'Tələbə',
    'applications.contact': 'Əlaqə',
    'applications.university': 'Universitet',
    'applications.status': 'Status',
    'applications.consultant': 'Konsultant',
    'applications.date': 'Tarix',
    'applications.general': 'Ümumi',
    'applications.unknown': 'Naməlum',
    'leads.title': 'Leads (CRM)',
    'leads.subtitle': '{count} lead',
    'leads.kanban': 'Kanban',
    'leads.table': 'Cədvəl',
    'leads.student': 'Tələbə',
    'leads.university': 'Universitet',
    'leads.status': 'Status',
    'leads.consultant': 'Konsultant',
    'leads.created': 'Yaradıldı',
    'users.title': 'İstifadəçilər',
    'audit.title': 'Audit jurnalı',
    'audit.who': 'Kim',
    'audit.action': 'Əməliyyat',
    'audit.when': 'Nə vaxt',
    'status.new': 'Yeni',
    'status.contacted': 'Əlaqə saxlanıldı',
    'status.document_collection': 'Sənədlər',
    'status.application_submitted': 'Göndərilib',
    'status.offer_received': 'Təklif',
    'status.accepted': 'Qəbul edilib',
    'status.visa_processing': 'Viza',
    'status.arrived': 'Gəlib',
    'status.completed': 'Tamamlandı',
    'status.lost': 'İtirilmiş',
    'role.admin': 'Admin',
    'role.consultant': 'Konsultant',
    'role.editor': 'Redaktor',
    'role.student': 'Tələbə',
  },
  en: {
    'nav.overview': 'Overview',
    'nav.applications': 'Applications',
    'nav.leads': 'Leads (CRM)',
    'nav.users': 'Users',
    'nav.audit': 'Audit Log',
    'nav.settings': 'Settings',
    'topbar.signOut': 'Sign out',
    'overview.title': 'Overview',
    'overview.subtitle': 'Pipeline health and recent activity',
    'overview.totalLeads': ' Total leads',
    'overview.new': 'New',
    'overview.unassigned': 'Unassigned',
    'overview.unassigned.hint': 'Needs a consultant',
    'overview.conversion': 'Conversion',
    'overview.conversion.hint': 'Completed / total',
    'overview.pipeline': 'Pipeline',
    'overview.recentActivity': 'Recent activity',
    'overview.noActivity': 'No activity yet',
    'overview.viewApplications': 'View applications →',
    'applications.title': 'Applications',
    'applications.subtitle': '{count} student applications · {new} new',
    'applications.all': 'All',
    'applications.empty': 'No applications yet',
    'applications.emptyHint': 'Student Apply form submissions will appear here',
    'applications.student': 'Student',
    'applications.contact': 'Contact',
    'applications.university': 'University',
    'applications.status': 'Status',
    'applications.consultant': 'Consultant',
    'applications.date': 'Date',
    'applications.general': 'General',
    'applications.unknown': 'Unknown',
    'leads.title': 'Leads (CRM)',
    'leads.subtitle': '{count} leads',
    'leads.kanban': 'Kanban',
    'leads.table': 'Table',
    'leads.student': 'Student',
    'leads.university': 'University',
    'leads.status': 'Status',
    'leads.consultant': 'Consultant',
    'leads.created': 'Created',
    'users.title': 'Users',
    'audit.title': 'Audit Log',
    'audit.who': 'Who',
    'audit.action': 'Action',
    'audit.when': 'When',
    'status.new': 'New',
    'status.contacted': 'Contacted',
    'status.document_collection': 'Documents',
    'status.application_submitted': 'Submitted',
    'status.offer_received': 'Offer',
    'status.accepted': 'Accepted',
    'status.visa_processing': 'Visa',
    'status.arrived': 'Arrived',
    'status.completed': 'Completed',
    'status.lost': 'Lost',
    'role.admin': 'Admin',
    'role.consultant': 'Consultant',
    'role.editor': 'Editor',
    'role.student': 'Student',
  },
} as const;

export async function getAdminLocale(): Promise<AdminLocale> {
  const store = await cookies();
  const raw = store.get(ADMIN_LOCALE_COOKIE)?.value;
  return raw === 'az' || raw === 'en' ? raw : 'az';
}

export async function getAdminT() {
  const locale = await getAdminLocale();
  const dict = ADMIN_TRANSLATIONS[locale];
  return {
    locale,
    t: (key: keyof typeof dict, params?: Record<string, string | number>): string => {
      let s: string = dict[key] ?? (ADMIN_TRANSLATIONS.en[key] ?? key);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          s = s.replace(`{${k}}`, String(v));
        }
      }
      return s;
    },
  };
}

/** Localized lead-status label map for admin components (status.* keys). */
export function leadStatusLabels(
  t: (key: never, params?: Record<string, string | number>) => string,
): import('@/types/crm').LeadStatusLabels {
  const statuses: import('@/types/crm').LeadStatus[] = [
    'new',
    'contacted',
    'document_collection',
    'application_submitted',
    'offer_received',
    'accepted',
    'visa_processing',
    'arrived',
    'completed',
    'lost',
  ];
  return Object.fromEntries(
    statuses.map((s) => [s, t(`status.${s}` as never)]),
  ) as import('@/types/crm').LeadStatusLabels;
}