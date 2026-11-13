# NISHTHA website: free setup & deployment

This project is prepared for GitHub Pages + Supabase. No Bolt subscription is needed.

## 1) Create a Supabase project (free tier)
1. Create a project at https://supabase.com/dashboard (Free plan is enough to start).
2. In **SQL Editor**, run the files in `supabase/migrations/` in chronological order:
   - `20261113204213_create_articles_and_subscribers.sql`
   - `20261114000100_secure_admin_rls.sql`
3. In **Authentication → Users**, create your admin user manually (email + a strong password).
4. In **Authentication → Settings**, turn OFF public sign-ups. Only the user you created should be able to sign in.
5. In **Project Settings → API** (or **Connect**), copy the Project URL and the publishable/anon key. Never use or expose the service-role key.

## 2) Add GitHub Actions secrets
Open https://github.com/dev-techx/nishtha-site/settings/secrets/actions and create:
- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase publishable/anon key

## 3) Enable GitHub Pages
1. Open https://github.com/dev-techx/nishtha-site/settings/pages
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and watch **Deploy website to GitHub Pages**. It should run after a push (or use Run workflow).
4. When it succeeds, visit https://dev-techx.github.io/nishtha-site/

## 4) Test
- Subscribe with a test email; it should appear in Supabase **Table Editor → subscribers**.
- Open the website's Admin link and sign in with the Supabase admin email/password.
- Check articles and subscriber list, then use the dashboard CSV export to save the emails.

## Security notes
- Keep the service-role key private and never put it in GitHub Actions `VITE_*` variables.
- The anon/publishable key is intended for browser use; the RLS migration protects admin-only actions.
- Public signup must remain disabled, otherwise any registered account can use the authenticated admin policies.
