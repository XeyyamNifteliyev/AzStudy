-- 0001_enums.sql
do $$ begin
  create type user_role as enum ('student','consultant','admin','editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum (
    'new','contacted','document_collection','application_submitted',
    'offer_received','accepted','visa_processing','arrived','completed','lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'draft','submitted','under_review','offer','rejected','enrolled'
  );
exception when duplicate_object then null; end $$;
