-- 0024_messages_unread_index.sql — BE-low-1: unread-message counts filter on
-- (sender_id, read_at) but only (lead_id, created_at) was indexed, so the
-- read filter was a sequential scan over each lead's messages.

create index if not exists messages_sender_read_idx
  on public.messages(sender_id, read_at)
  where read_at is null;
