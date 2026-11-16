-- Issue-based magazine structure. Safe to run once; existing articles are retained.
CREATE TABLE IF NOT EXISTS public.magazine_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number integer NOT NULL UNIQUE CHECK (issue_number > 0),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS issue_id uuid REFERENCES public.magazine_issues(id) ON DELETE SET NULL;
INSERT INTO public.magazine_issues(issue_number,title,description,published_at)
VALUES (1,'Issue 01','The inaugural NISHTHA magazine issue',now())
ON CONFLICT(issue_number) DO NOTHING;
UPDATE public.articles SET issue_id=(SELECT id FROM public.magazine_issues WHERE issue_number=1)
WHERE issue_id IS NULL;
ALTER TABLE public.magazine_issues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "issues_public_read" ON public.magazine_issues;
DROP POLICY IF EXISTS "issues_admin_insert" ON public.magazine_issues;
DROP POLICY IF EXISTS "issues_admin_update" ON public.magazine_issues;
DROP POLICY IF EXISTS "issues_admin_delete" ON public.magazine_issues;
CREATE POLICY "issues_public_read" ON public.magazine_issues FOR SELECT TO anon,authenticated USING (true);
CREATE POLICY "issues_admin_insert" ON public.magazine_issues FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "issues_admin_update" ON public.magazine_issues FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "issues_admin_delete" ON public.magazine_issues FOR DELETE TO authenticated USING (true);
GRANT SELECT ON public.magazine_issues TO anon,authenticated;
GRANT INSERT,UPDATE,DELETE ON public.magazine_issues TO authenticated;
