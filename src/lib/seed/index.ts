export * from './images';
// B7: studyleo-catalog moved to scripts/data/ — it's 68K lines (2.3MB) and
// only needed by `scripts/seed-content.ts` during db:reset, not by the app
// or `next build`. Re-exporting it here would pull it into every build.
export * from './countries';
export * from './cities';
export * from './programs';
export * from './universities';
export * from './university-programs';
export * from './scholarships';
export * from './dormitories';
export * from './reviews';
export * from './faqs';
export * from './blog';