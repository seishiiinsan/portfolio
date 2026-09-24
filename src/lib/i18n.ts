export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export type L10n = { fr: string; en: string };

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

export function t(v: L10n | null | undefined, locale: Locale): string {
  if (!v) return "";
  return v[locale] || v[locale === "fr" ? "en" : "fr"] || "";
}

const dict = {
  fr: {
    nav: { about: "À propos", work: "Projets", experience: "Parcours", contact: "Contact" },
    available: "Ouvert aux projets",
    unavailable: "Indisponible",
    scroll: "Défiler",
    selected: "Projets sélectionnés",
    allProjects: "Tous les projets",
    index: "Index",
    about: "À propos",
    experience: "Parcours",
    work: "Expérience",
    education: "Formation",
    present: "Présent",
    contact: "Contact",
    contactTitle: "Un projet ? Parlons-en.",
    name: "Nom",
    email: "Email",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi…",
    sent: "Message envoyé. Merci !",
    error: "Erreur. Réessaie ou écris-moi directement.",
    downloadCv: "Télécharger le CV",
    back: "Retour",
    year: "Année",
    role: "Rôle",
    stack: "Stack",
    links: "Liens",
    repo: "Code source",
    demo: "Démo",
    next: "Projet suivant",
    noProjects: "Aucun projet pour le moment.",
    theme: "Thème",
  },
  en: {
    nav: { about: "About", work: "Work", experience: "Journey", contact: "Contact" },
    available: "Open to projects",
    unavailable: "Unavailable",
    scroll: "Scroll",
    selected: "Selected work",
    allProjects: "All projects",
    index: "Index",
    about: "About",
    experience: "Journey",
    work: "Experience",
    education: "Education",
    present: "Present",
    contact: "Contact",
    contactTitle: "Got a project? Let's talk.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    sent: "Message sent. Thanks!",
    error: "Error. Try again or email me directly.",
    downloadCv: "Download resume",
    back: "Back",
    year: "Year",
    role: "Role",
    stack: "Stack",
    links: "Links",
    repo: "Source code",
    demo: "Live demo",
    next: "Next project",
    noProjects: "No projects yet.",
    theme: "Theme",
  },
} as const;

export type Dict = (typeof dict)[Locale];
export const getDict = (l: Locale): Dict => dict[l];
