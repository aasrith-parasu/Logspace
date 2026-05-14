-- ─────────────────────────────────────────────────────────────────────────────
-- Logspace — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Users ────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id              text primary key,          -- NextAuth token.sub (Google sub)
  username        text unique not null,
  display_name    text not null,
  avatar          text,
  bio             text,
  location        text,
  interests       text[]        default '{}',
  followers_count integer       default 0,
  following_count integer       default 0,
  total_projects  integer       default 0,
  total_entries   integer       default 0,
  created_at      timestamptz   default now(),
  updated_at      timestamptz   default now()
);

-- ── Projects ─────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null references public.users(id) on delete cascade,
  title           text not null,
  slug            text not null,
  tagline         text not null default '',
  description     text,
  categories      text[]        default '{}',
  cover_image     text,
  start_date      date          not null default current_date,
  status          text          not null default 'Active',
  visibility      text          not null default 'Public',
  entry_count     integer       default 0,
  follower_count  integer       default 0,
  total_reactions integer       default 0,
  streak_count    integer       default 0,
  linked_urls     jsonb         default '[]',
  health_score    integer       default 100,
  created_at      timestamptz   default now(),
  updated_at      timestamptz   default now(),
  unique(user_id, slug)
);

-- ── Entries ──────────────────────────────────────────────────────────────────
create table if not exists public.entries (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  user_id       text not null references public.users(id) on delete cascade,
  title         text,
  body          text not null,
  date          date not null default current_date,
  is_milestone  boolean       default false,
  mood_tag      text,
  media_urls    text[]        default '{}',
  reactions     jsonb         default '{"heart":0,"fire":0,"celebrate":0,"inspired":0}',
  comment_count integer       default 0,
  view_count    integer       default 0,
  hashtags      text[]        default '{}',
  created_at    timestamptz   default now(),
  updated_at    timestamptz   default now()
);

-- ── User follows ─────────────────────────────────────────────────────────────
create table if not exists public.user_follows (
  follower_id  text not null references public.users(id) on delete cascade,
  following_id text not null references public.users(id) on delete cascade,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id)
);

-- ── Project follows ───────────────────────────────────────────────────────────
create table if not exists public.project_follows (
  user_id    text not null references public.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, project_id)
);

-- ── Reactions ─────────────────────────────────────────────────────────────────
create table if not exists public.reactions (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid not null references public.entries(id) on delete cascade,
  user_id    text not null references public.users(id) on delete cascade,
  type       text not null,   -- 'heart' | 'fire' | 'celebrate' | 'inspired'
  created_at timestamptz default now(),
  unique(entry_id, user_id, type)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_projects_user_id    on public.projects(user_id);
create index if not exists idx_projects_visibility on public.projects(visibility);
create index if not exists idx_projects_updated_at on public.projects(updated_at desc);
create index if not exists idx_entries_project_id  on public.entries(project_id);
create index if not exists idx_entries_user_id     on public.entries(user_id);
create index if not exists idx_entries_date        on public.entries(date desc);

-- ── Helper: increment entry count ────────────────────────────────────────────
create or replace function public.increment_entry_count(project_id uuid)
returns void language sql security definer as $$
  update public.projects
  set entry_count = entry_count + 1,
      updated_at  = now()
  where id = project_id;
$$;

-- ── updated_at trigger ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create or replace trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create or replace trigger trg_entries_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.users          enable row level security;
alter table public.projects       enable row level security;
alter table public.entries        enable row level security;
alter table public.user_follows   enable row level security;
alter table public.project_follows enable row level security;
alter table public.reactions      enable row level security;

-- Users: anyone can read, only you can update your own row
create policy "users_select_all"   on public.users for select using (true);
create policy "users_insert_own"   on public.users for insert with check (true);
create policy "users_update_own"   on public.users for update using (true);

-- Projects: public projects readable by all; insert/update only by owner
create policy "projects_select_public" on public.projects for select
  using (visibility = 'Public');
create policy "projects_insert_own"    on public.projects for insert with check (true);
create policy "projects_update_own"    on public.projects for update using (true);
create policy "projects_delete_own"    on public.projects for delete using (true);

-- Entries: readable if parent project is public
create policy "entries_select_public" on public.entries for select using (true);
create policy "entries_insert_own"    on public.entries for insert with check (true);
create policy "entries_update_own"    on public.entries for update using (true);
create policy "entries_delete_own"    on public.entries for delete using (true);

-- Follows: open read, open write (auth enforced in API routes)
create policy "user_follows_select"   on public.user_follows   for select using (true);
create policy "user_follows_insert"   on public.user_follows   for insert with check (true);
create policy "user_follows_delete"   on public.user_follows   for delete using (true);

create policy "project_follows_select" on public.project_follows for select using (true);
create policy "project_follows_insert" on public.project_follows for insert with check (true);
create policy "project_follows_delete" on public.project_follows for delete using (true);

-- Reactions
create policy "reactions_select" on public.reactions for select using (true);
create policy "reactions_insert" on public.reactions for insert with check (true);
create policy "reactions_delete" on public.reactions for delete using (true);
