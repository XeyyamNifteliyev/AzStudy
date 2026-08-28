// src/lib/crm/index.ts
import { getPool } from '@/lib/db';
import { createPgCrm } from './pg-repository';
import type { CrmRepository } from './repositories';

function createCrmLayer(): CrmRepository {
  return createPgCrm(getPool);
}

export const crm: CrmRepository = createCrmLayer();

export type { CrmRepository } from './repositories';
