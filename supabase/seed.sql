-- seed.sql — demo data for local dev. Safe to re-run (idempotent-ish via fixed UUIDs).
insert into public.profiles (id, email, full_name, role, phone, whatsapp, country_code) values
  ('11111111-1111-1111-1111-111111111111','admin@azstudy.local','Admin User','admin','+994500000001','+994500000001','AZ'),
  ('22222222-2222-2222-2222-222222222222','leyla@azstudy.local','Leyla Aliyeva','consultant','+994500000002','+994500000002','AZ'),
  ('33333333-3333-3333-3333-333333333333','tural@azstudy.local','Tural Mammadov','consultant','+994500000003','+994500000003','AZ'),
  ('44444444-4444-4444-4444-444444444444','student1@example.com','Ali Veli','student','+994500000004','+994500000004','AZ'),
  ('55555555-5555-5555-5555-555555555555','student2@example.com','Madina Yusifova','student','+998700000005','+998700000005','UZ')
on conflict (email) do nothing;

-- university_id values are soft-refs to seed universities (src/lib/seed/universities.ts).
insert into public.leads (id, user_id, university_id, program_id, status, source, assigned_consultant_id, notes) values
  ('aaaaaaaa-0000-0000-0000-000000000001','44444444-4444-4444-4444-444444444444','u-bsu','p-med-bach','new','website','22222222-2222-2222-2222-222222222222','Interested in medicine program'),
  ('aaaaaaaa-0000-0000-0000-000000000002','55555555-5555-5555-5555-555555555555','u-ada','p-cs-bach','contacted','referral','33333333-3333-3333-3333-333333333333','Prefers Baku'),
  ('aaaaaaaa-0000-0000-0000-000000000003','44444444-4444-4444-4444-444444444444','u-unec','p-bus-bach','document_collection','website',null,'Needs scholarship info'),
  ('aaaaaaaa-0000-0000-0000-000000000004','55555555-5555-5555-5555-555555555555','u-gsu','p-eng-civil','application_submitted','social','22222222-2222-2222-2222-222222222222',''),
  ('aaaaaaaa-0000-0000-0000-000000000005','44444444-4444-4444-4444-444444444444','u-ada','p-law-bach','offer_received','website','33333333-3333-3333-3333-333333333333','Conditional offer'),
  ('aaaaaaaa-0000-0000-0000-000000000006','55555555-5555-5555-5555-555555555555','u-bsu','p-dent-bach','accepted','website','22222222-2222-2222-2222-222222222222',''),
  ('aaaaaaaa-0000-0000-0000-000000000007','44444444-4444-4444-4444-444444444444','u-unec','p-bus-economics','visa_processing','referral','33333333-3333-3333-3333-333333333333','Visa docs submitted'),
  ('aaaaaaaa-0000-0000-0000-000000000008','55555555-5555-5555-5555-555555555555','u-gsu','p-cs-bach','arrived','website','22222222-2222-2222-2222-222222222222','Arrived in Ganja'),
  ('aaaaaaaa-0000-0000-0000-000000000009','44444444-4444-4444-4444-444444444444','u-bsu','p-med-bach','completed','website','33333333-3333-3333-3333-333333333333','Enrolled Fall 2025'),
  ('aaaaaaaa-0000-0000-0000-000000000010','55555555-5555-5555-5555-555555555555','u-unec','p-bus-bach','new','website',null,''),
  ('aaaaaaaa-0000-0000-0000-000000000011','44444444-4444-4444-4444-444444444444','u-ada','p-cs-bach','new','social',null,'Wants CS program'),
  ('aaaaaaaa-0000-0000-0000-000000000012','55555555-5555-5555-5555-555555555555','u-bsu','p-med-bach','contacted','website','22222222-2222-2222-2222-222222222222','')
on conflict do nothing;

insert into public.applications (id, lead_id, university_id, program_id, status, assigned_consultant_id) values
  ('bbbbbbbb-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000004','u-gsu','p-eng-civil','submitted','22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000005','u-ada','p-law-bach','offer','33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000009','u-bsu','p-med-bach','enrolled','33333333-3333-3333-3333-333333333333')
on conflict do nothing;

insert into public.application_documents (application_id, file_name, file_url, mime_type, size_bytes, verified) values
  ('bbbbbbbb-0000-0000-0000-000000000001','passport.pdf','/uploads/demo-passport.pdf','application/pdf',240000,false),
  ('bbbbbbbb-0000-0000-0000-000000000001','diploma.pdf','/uploads/demo-diploma.pdf','application/pdf',180000,true)
on conflict do nothing;

insert into public.audit_logs (user_id, action, entity, entity_id, metadata) values
  ('11111111-1111-1111-1111-111111111111','lead.create','lead','aaaaaaaa-0000-0000-0000-000000000001','{}'::jsonb),
  ('22222222-2222-2222-2222-222222222222','lead.update_status','lead','aaaaaaaa-0000-0000-0000-000000000002','{"from":"new","to":"contacted"}'::jsonb)
on conflict do nothing;
