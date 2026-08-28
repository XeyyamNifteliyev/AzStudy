-- 0014_city_living_cost.sql — monthly living cost (USD) per city for cost estimates.

alter table public.cities
  add column if not exists monthly_living_cost_usd numeric(12,2);
