import type { L10n } from "./i18n";

export type Social = { label: string; url: string };

export type Settings = {
  id: number;
  name: string;
  accent: string;
  role: L10n;
  hero: L10n;
  about: L10n;
  location: string;
  available: boolean;
  email: string;
  socials: Social[];
  cv_url: string | null;
  studio_name: string | null;
  studio_url: string | null;
  booking_url: string | null;
  trainings_count: number;
  stack: string[];
  cta_label: L10n;
  cta_url: string | null;
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  title: L10n;
  summary: L10n;
  content: L10n;
  role: L10n;
  cover_url: string | null;
  gallery: string[];
  tags: string[];
  year: number | null;
  repo_url: string | null;
  demo_url: string | null;
  featured: boolean;
  published: boolean;
  position: number;
  created_at: string;
  video_url: string | null;
  metrics: Metric[];
  preview_token: string;
};

export type Metric = { value: string; label: L10n };

export type Page = { slug: string; title: L10n; content: L10n; updated_at: string };

export type Post = {
  id: string;
  slug: string;
  title: L10n;
  summary: L10n;
  content: L10n;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
};

export type Testimonial = { id: string; author: string; role: string | null; url: string | null; quote: L10n; position: number };

export type Subscriber = { id: string; email: string; locale: string; created_at: string };

export type Experience = {
  id: string;
  kind: "work" | "education";
  title: L10n;
  org: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: L10n;
  position: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  read: boolean;
  created_at: string;
};
