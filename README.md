# Portfolio — Gabin Hallosserie

Next.js 16 · React 19 `<ViewTransition>` · Tailwind 4 · Motion · Lenis · Supabase.

Style suisse, FR/EN, thème clair/sombre, loader intro, curseur custom, grain, transitions de pages natives
(slide directionnel + morph du titre projet liste → détail). Admin `/admin` (GitHub OAuth) pour projets,
parcours, messages et réglages (couleur d'accent, textes hero/about, réseaux, CV PDF).

## Dev

```bash
cp .env.example .env.local   # renseigner NEXT_PUBLIC_SITE_URL
npm i
npm run dev
```

## Supabase

Projet `portfolio` (eu-west-3). Schéma : `supabase/migrations/0001_init.sql` (déjà appliqué).
Tables : `settings` (ligne unique), `projects`, `experiences`, `messages`, `admins`. Bucket public `media`.
RLS : lecture publique, écriture réservée à `public.is_admin()` = login GitHub présent dans `public.admins`.

### Activer la connexion GitHub (une fois)

1. GitHub → Settings → Developer settings → OAuth Apps → New.
   Callback URL : `https://wuailekujwcdkpqvycga.supabase.co/auth/v1/callback`
2. Supabase → Authentication → Sign In / Providers → GitHub : coller Client ID + Secret.
3. Supabase → Authentication → URL Configuration : Site URL = URL de prod,
   Redirect URLs += `http://localhost:3000/auth/callback`, `https://<prod>/auth/callback`.

Ajouter un autre admin : `insert into public.admins (login) values ('<github-login>');`

## Déploiement Vercel

Importer le repo, variables d'env : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_SITE_URL`. Les pages publiques sont statiques et régénérées à chaque sauvegarde admin
(`revalidatePath`).
