-- Réglages étendus
alter table public.settings
  add column booking_url text,
  add column trainings_count int not null default 0,
  add column stack text[] not null default '{TypeScript,React,Next.js,Node.js,PHP,Laravel,Prisma,PostgreSQL,Docker,VPS,CI/CD}',
  add column cta_label jsonb not null default '{"fr":"","en":""}',
  add column cta_url text;

-- Projets : vidéo, chiffres clés, lien de prévisualisation privé
alter table public.projects
  add column video_url text,
  add column metrics jsonb not null default '[]',
  add column preview_token uuid not null default gen_random_uuid();

-- Pages éditables (now, uses, studio…)
create table public.pages (
  slug text primary key,
  title jsonb not null default '{"fr":"","en":""}',
  content jsonb not null default '{"fr":"","en":""}',
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{"fr":"","en":""}',
  summary jsonb not null default '{"fr":"","en":""}',
  content jsonb not null default '{"fr":"","en":""}',
  cover_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  url text,
  quote jsonb not null default '{"fr":"","en":""}',
  position int not null default 0
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 320),
  locale text not null default 'en' check (locale in ('fr','en')),
  created_at timestamptz not null default now()
);

create table public.page_views (
  id bigserial primary key,
  path text not null check (char_length(path) between 1 and 300),
  created_at timestamptz not null default now()
);
create index page_views_created_at on public.page_views (created_at);

alter table public.messages add column ip_hash text;

alter table public.pages enable row level security;
alter table public.posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.subscribers enable row level security;
alter table public.page_views enable row level security;

create policy "pages read" on public.pages for select using (true);
create policy "pages admin" on public.pages for all using (public.is_admin()) with check (public.is_admin());
create policy "posts read" on public.posts for select using (published or public.is_admin());
create policy "posts admin" on public.posts for all using (public.is_admin()) with check (public.is_admin());
create policy "testimonials read" on public.testimonials for select using (true);
create policy "testimonials admin" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "subscribers insert" on public.subscribers for insert with check (true);
create policy "subscribers admin" on public.subscribers for all using (public.is_admin()) with check (public.is_admin());
create policy "views insert" on public.page_views for insert with check (true);
create policy "views admin" on public.page_views for select using (public.is_admin());

-- Messages : insertion uniquement via fonction limitée en débit
drop policy "msg insert" on public.messages;

create or replace function public.submit_message(p_name text, p_email text, p_body text, p_ip_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.messages
      where created_at > now() - interval '1 hour'
        and (ip_hash = p_ip_hash or lower(email) = lower(p_email))) >= 3 then
    return false;
  end if;
  insert into public.messages (name, email, body, ip_hash) values (p_name, p_email, p_body, p_ip_hash);
  return true;
end;
$$;
revoke all on function public.submit_message(text, text, text, text) from public;
grant execute on function public.submit_message(text, text, text, text) to anon, authenticated;

-- Prévisualisation privée d'un projet non publié
create or replace function public.project_by_preview_token(p_token uuid)
returns setof public.projects language sql stable security definer set search_path = '' as $$
  select * from public.projects where preview_token = p_token limit 1;
$$;
revoke all on function public.project_by_preview_token(uuid) from public;
grant execute on function public.project_by_preview_token(uuid) to anon, authenticated;
