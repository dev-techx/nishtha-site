/*
  Secure the app after migrating the admin login to Supabase Auth.

  IMPORTANT: Disable public sign-ups in Supabase Auth settings and create the
  sole admin user manually. Any authenticated account can manage content.
*/
-- Remove the old permissive policies (which allowed anon users to modify/read everything).
DROP POLICY IF EXISTS "articles_select_all" ON public.articles;
DROP POLICY IF EXISTS "articles_insert_all" ON public.articles;
DROP POLICY IF EXISTS "articles_update_all" ON public.articles;
DROP POLICY IF EXISTS "articles_delete_all" ON public.articles;
DROP POLICY IF EXISTS "subscribers_select_all" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_insert_all" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_delete_all" ON public.subscribers;

-- Also remove any policies from prior iterations with these names.
DROP POLICY IF EXISTS "articles_public_read" ON public.articles;
DROP POLICY IF EXISTS "articles_admin_insert" ON public.articles;
DROP POLICY IF EXISTS "articles_admin_update" ON public.articles;
DROP POLICY IF EXISTS "articles_admin_delete" ON public.articles;
DROP POLICY IF EXISTS "subscribers_admin_read" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_public_insert" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_admin_delete" ON public.subscribers;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone may read published articles; only signed-in admin can mutate them.
CREATE POLICY "articles_public_read"
  ON public.articles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "articles_admin_insert"
  ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "articles_admin_update"
  ON public.articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "articles_admin_delete"
  ON public.articles FOR DELETE TO authenticated USING (true);

-- Newsletter visitors may submit emails. Only authenticated admin can view/delete.
CREATE POLICY "subscribers_public_insert"
  ON public.subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "subscribers_admin_read"
  ON public.subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "subscribers_admin_delete"
  ON public.subscribers FOR DELETE TO authenticated USING (true);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT INSERT ON public.subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.subscribers TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.articles FROM anon;
REVOKE SELECT, DELETE ON public.subscribers FROM anon;
