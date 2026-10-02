# Supabase setup for Nalaraya

1. Create a Supabase project and copy its project URL and publishable/anon key to `.env.local` using `.env.example` as the template. Never add the service-role key to the app.
2. Run `supabase/migrations/20261002000000_auth_progress.sql` in the Supabase SQL Editor. This creates the profile and progress tables, row-level policies, and the atomic progress function.
3. In Supabase Authentication, enable email/password and Google. For Google, configure the Google OAuth client ID and secret in Supabase, and set Google's authorized redirect URI to `https://<project-ref>.supabase.co/auth/v1/callback`.
4. In Supabase Authentication → URL Configuration, set the Site URL to your production origin. Add `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback` to Redirect URLs. Add the corresponding `/auth/callback` URLs for any preview origin you use. Email confirmation and password recovery use this callback.
5. Restart Next.js after creating `.env.local`. Test sign-up, email confirmation, password reset, and Google sign-in on the configured origin.

Only the two `/praktikum` routes and `/dashboard` require an account. Onboarding collects role, grade, and referral source before opening those pages. Existing public introductory quiz completion is imported from the visitor's browser into their account when they open the dashboard or that module while signed in.

The app cannot complete a live sign-in or database isolation test until the Supabase project and provider settings above are configured.

https://gkzwllmxohjwqfabgvuq.supabase.co/auth/v1/callback
