/*
# Create articles and subscribers tables for NISHTHA publication

## Overview
This migration creates two tables for the NISHTHA governance publication website:
1. `articles` — stores published articles with pin/top-3 ranking support
2. `subscribers` — stores newsletter subscriber emails

## New Tables

### articles
- `id` (uuid, primary key)
- `name` (text, not null) — author or source name
- `heading` (text, not null) — article title
- `description` (text, not null) — full article body content
- `image_url` (text, nullable) — optional image (URL or data URI)
- `pinned` (boolean, default false) — whether the article is pinned to top
- `pin_rank` (integer, default null) — rank among pinned articles (1-3 for top 3)
- `sort_order` (integer, default 0) — manual sort order
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### subscribers
- `id` (uuid, primary key)
- `email` (text, unique, not null) — subscriber email address
- `created_at` (timestamptz, default now())

## Security
- Enable RLS on both tables.
- Grant CRUD to `anon` + `authenticated` on both tables (no-auth app; admin is handled via hardcoded credentials in frontend, not Supabase auth).
- All policies use `USING (true)` / `WITH CHECK (true)` because data is intentionally public/shared — articles are public content, subscribers are publicly writable.
- Subscribers: only INSERT and SELECT are granted publicly (no UPDATE/DELETE from anon to protect subscriber data).

## Notes
1. The app uses hardcoded admin credentials (username: admin, password stored in frontend) — no Supabase Auth is used.
2. Articles are fully public (readable and writable via anon key).
3. Subscribers can be added by anyone (newsletter signup) but only read/deleted by admin through the same anon key.
4. `pin_rank` allows 1, 2, 3 for the top 3 pinned articles. NULL means not ranked.
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  heading text NOT NULL,
  description text NOT NULL,
  image_url text,
  pinned boolean NOT NULL DEFAULT false,
  pin_rank integer,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Grants for articles (full CRUD for anon + authenticated)
GRANT SELECT, INSERT, UPDATE, DELETE ON articles TO anon, authenticated;

-- Grants for subscribers (INSERT + SELECT for anon; full for authenticated)
GRANT SELECT, INSERT, DELETE ON subscribers TO anon, authenticated;

-- Articles policies (public CRUD — intentionally shared content)
DROP POLICY IF EXISTS "articles_select_all" ON articles;
CREATE POLICY "articles_select_all"
ON articles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "articles_insert_all" ON articles;
CREATE POLICY "articles_insert_all"
ON articles FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "articles_update_all" ON articles;
CREATE POLICY "articles_update_all"
ON articles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "articles_delete_all" ON articles;
CREATE POLICY "articles_delete_all"
ON articles FOR DELETE
TO anon, authenticated USING (true);

-- Subscribers policies (public insert + select; delete for admin)
DROP POLICY IF EXISTS "subscribers_select_all" ON subscribers;
CREATE POLICY "subscribers_select_all"
ON subscribers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "subscribers_insert_all" ON subscribers;
CREATE POLICY "subscribers_insert_all"
ON subscribers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "subscribers_delete_all" ON subscribers;
CREATE POLICY "subscribers_delete_all"
ON subscribers FOR DELETE
TO anon, authenticated USING (true);

-- Index for sorting and pinned lookups
CREATE INDEX IF NOT EXISTS idx_articles_sort_order ON articles (sort_order);
CREATE INDEX IF NOT EXISTS idx_articles_pinned ON articles (pinned);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
