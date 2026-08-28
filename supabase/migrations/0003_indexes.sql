-- 0003_indexes.sql
create index if not exists idx_leads_status      on public.leads(status);
create index if not exists idx_leads_consultant   on public.leads(assigned_consultant_id);
create index if not exists idx_leads_user         on public.leads(user_id);
create index if not exists idx_leads_created      on public.leads(created_at desc);
create index if not exists idx_apps_lead          on public.applications(lead_id);
create index if not exists idx_apps_status        on public.applications(status);
create index if not exists idx_docs_application   on public.application_documents(application_id);
create index if not exists idx_audit_entity       on public.audit_logs(entity, entity_id);
create index if not exists idx_audit_user         on public.audit_logs(user_id);
create index if not exists idx_audit_created      on public.audit_logs(created_at desc);
