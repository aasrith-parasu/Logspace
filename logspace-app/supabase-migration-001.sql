-- Migration 001: social links on users, cover image on projects
-- Run in Supabase SQL Editor

alter table public.users
  add column if not exists social_links jsonb default '{}';

-- social_links shape: { github, twitter, linkedin, website }
-- Example: { "github": "https://github.com/user", "twitter": "https://x.com/user" }
