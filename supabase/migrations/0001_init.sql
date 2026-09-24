-- Admins autorisés (login GitHub)
create table public.admins (login text primary key);
insert into public.admins (login) values ('seishiiinsan');

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.identities i
    join public.admins a on lower(a.login) = lower(i.identity_data->>'user_name')
    where i.user_id = auth.uid() and i.provider = 'github'
  );
$$;

-- Réglages (ligne unique)
create table public.settings (
  id int primary key default 1 check (id = 1),
  name text not null default 'Gabin Hallosserie',
  accent text not null default '#be3455',
  role jsonb not null default '{"fr":"Développeur logiciel","en":"Software developer"}',
  hero jsonb not null default '{"fr":"Étudiant en M1 EADL, alternant chez BeProject. Je conçois et développe des logiciels robustes.","en":"M1 EADL student, apprentice at BeProject. I design and build robust software."}',
  about jsonb not null default '{"fr":"","en":""}',
  location text not null default 'France',
  available boolean not null default true,
  email text not null default 'gabinhalloss@gmail.com',
  socials jsonb not null default '[{"label":"GitHub","url":"https://github.com/seishiiinsan"}]',
  cv_url text,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{"fr":"","en":""}',
  summary jsonb not null default '{"fr":"","en":""}',
  content jsonb not null default '{"fr":"","en":""}',
  role jsonb not null default '{"fr":"","en":""}',
  cover_url text,
  gallery text[] not null default '{}',
  tags text[] not null default '{}',
  year int,
  repo_url text,
  demo_url text,
  featured boolean not null default false,
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('work','education')),
  title jsonb not null default '{"fr":"","en":""}',
  org text not null default '',
  location text,
  start_date text not null default '',
  end_date text,
  description jsonb not null default '{"fr":"","en":""}',
  position int not null default 0
);
insert into public.experiences (kind, title, org, start_date, end_date, description, position) values
 ('work','{"fr":"Développeur logiciel — alternance","en":"Software developer — apprenticeship"}','BeProject','2025',null,'{"fr":"","en":""}',0),
 ('education','{"fr":"Master Expert Architecture et Développement Logiciel (M1)","en":"Master in Software Architecture & Development (M1)"}','EADL','2025',null,'{"fr":"","en":""}',1);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  body text not null check (char_length(body) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.messages enable row level security;

create policy "admins read self" on public.admins for select using (public.is_admin());

create policy "settings read" on public.settings for select using (true);
create policy "settings admin" on public.settings for update using (public.is_admin()) with check (public.is_admin());

create policy "projects read" on public.projects for select using (published or public.is_admin());
create policy "projects admin" on public.projects for all using (public.is_admin()) with check (public.is_admin());

create policy "exp read" on public.experiences for select using (true);
create policy "exp admin" on public.experiences for all using (public.is_admin()) with check (public.is_admin());

create policy "msg insert" on public.messages for insert with check (true);
create policy "msg admin" on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- Storage
insert into storage.buckets (id, name, public) values ('media','media', true) on conflict do nothing;
create policy "media read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
