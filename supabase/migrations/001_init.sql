create extension if not exists pgcrypto;
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  recipe_name text not null,
  ingredients jsonb not null default '[]'::jsonb,
  drink_sizes jsonb not null default '[]'::jsonb,
  labor_cost numeric not null default 0,
  electricity_cost numeric not null default 0,
  packaging_cost numeric not null default 0,
  delivery_fee numeric not null default 0,
  ingredient_cost numeric not null default 0,
  total_cost numeric not null default 0,
  selling_price numeric not null default 0,
  profit numeric not null default 0,
  margin_pct numeric not null default 0,
  tags text[] not null default '{}',
  category text,
  visibility text not null default 'private',
  status text not null default 'draft',
  analytics jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists recipe_comments (id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, body text not null, created_at timestamptz default now());
create table if not exists recipe_likes (id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, created_at timestamptz default now(), unique(recipe_id, user_id));
create table if not exists recipe_saves (id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, created_at timestamptz default now(), unique(recipe_id, user_id));
create table if not exists recipe_views (id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade, user_id uuid references profiles(id), created_at timestamptz default now());
create table if not exists favorite_recipes (id uuid primary key default gen_random_uuid(), recipe_id uuid references recipes(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, created_at timestamptz default now(), unique(recipe_id, user_id));
create table if not exists notifications (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, type text not null, payload jsonb not null default '{}'::jsonb, read_at timestamptz, created_at timestamptz default now());
create table if not exists affiliate_products (id uuid primary key default gen_random_uuid(), title text not null, provider text not null, affiliate_url text not null, image_url text, category text, created_at timestamptz default now());
create table if not exists analytics_events (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), event_name text not null, payload jsonb not null default '{}'::jsonb, created_at timestamptz default now());
create index if not exists idx_recipes_user on recipes(user_id);
create index if not exists idx_recipes_visibility on recipes(visibility);
create index if not exists idx_analytics_event_name on analytics_events(event_name);
alter table profiles enable row level security;
alter table recipes enable row level security;
create policy "profile self" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "recipe owner full" on recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recipe public read" on recipes for select using (visibility='public');
