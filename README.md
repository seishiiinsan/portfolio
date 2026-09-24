<div align="center">

# Gabin Hallosserie — Portfolio

Portfolio personnel · Étudiant M1 EADL, développeur logiciel en alternance chez [BeProject](https://www.beproject.fr/).

**[gabin-hallosserie.com](https://gabin-hallosserie.com)**

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%C2%B7%20Auth%20%C2%B7%20Storage-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel)

![Accueil](docs/hero.png)

</div>

## Aperçu

| Thème sombre | Mobile |
| --- | --- |
| ![Contact, thème sombre](docs/contact-dark.png) | ![Accueil mobile](docs/mobile.png) |

## Fonctionnalités

**Site public**
- Style suisse : grille visible, typographie Space Grotesk / Space Mono, une couleur d'accent.
- Bilingue FR / EN (`/fr`, `/en`), langue détectée automatiquement.
- Thème clair / sombre, suit le système, bascule animée.
- Accueil en une page : hero, à propos, projets mis en avant, parcours, contact.
- Index des projets avec aperçu d'image au survol, pages détail en Markdown avec galerie.
- Formulaire de contact enregistré en base.

**Animations**
- Transitions de pages natives avec React `<ViewTransition>` : glissement directionnel, morph du titre projet de la liste vers le détail, header fixe.
- Loader d'intro, curseur personnalisé, grain, défilement fluide (Lenis), parallax, textes révélés au scroll (Motion).
- `prefers-reduced-motion` respecté.

**Administration (`/admin`)**
- Connexion GitHub OAuth, réservée aux comptes listés dans `public.admins`.
- Réglages : couleur d'accent, textes hero / à propos (FR/EN), réseaux, CV PDF, disponibilité.
- Projets : création, édition, ordre, mise en avant, brouillon, upload cover et galerie.
- Parcours (expériences, formations) et messages reçus.
- Chaque sauvegarde régénère les pages statiques (`revalidatePath`).

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, `proxy.ts`), React 19, TypeScript |
| Style | Tailwind CSS 4 |
| Animation | Motion, Lenis, View Transitions API |
| Données | Supabase : Postgres + RLS, Auth GitHub, Storage |
| Hébergement | Vercel |

## Structure

```
src/
├── app/
│   ├── [locale]/          # site public FR/EN (accueil, projets, détail)
│   ├── admin/             # panneau d'administration
│   └── auth/callback/     # retour OAuth
├── components/            # UI et animations
├── lib/                   # données, i18n, clients Supabase
└── proxy.ts               # redirection de langue, garde admin
supabase/migrations/       # schéma SQL + RLS
```

## Développement

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variables (toutes publiques, voir `.env.example`) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clé publishable (accès limité par la RLS) |
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site |

## Base de données

Schéma dans [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) :
`settings` (ligne unique), `projects`, `experiences`, `messages`, `admins`, bucket public `media`.

La RLS autorise la lecture publique et réserve l'écriture à `public.is_admin()`. Les visiteurs peuvent seulement envoyer un message.

Ajouter un administrateur :

```sql
insert into public.admins (login) values ('<login-github>');
```

### Connexion GitHub

1. Créer une OAuth App GitHub, callback `https://<projet>.supabase.co/auth/v1/callback`.
2. Supabase → Authentication → Providers → GitHub : Client ID + Secret.
3. Supabase → Authentication → URL Configuration : Site URL + `/auth/callback` en redirect URL.

## Déploiement

Vercel, branche `main`. Le domaine `gabin-hallosserie.com` pointe vers le projet, `www` redirige vers l'apex.

---

© Gabin Hallosserie
