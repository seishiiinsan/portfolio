import { requireAdmin } from "@/lib/admin";
import type { Settings } from "@/lib/types";
import { saveSettings } from "../actions";
import { Field, L10nField, Submit, Title, input } from "../ui";
import { AccentPicker } from "../accent-picker";
import { MediaInput } from "../media-input";

export default async function SettingsPage({ searchParams }: PageProps<"/admin">) {
  const db = await requireAdmin();
  const { data } = await db.from("settings").select("*").eq("id", 1).single();
  const s = data as Settings;
  const { saved } = await searchParams;

  return (
    <>
      <Title aside={saved && <span className="font-mono text-xs uppercase text-accent">Enregistré ✓</span>}>Réglages</Title>
      <form action={saveSettings} className="grid max-w-4xl gap-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom">
            <input name="name" defaultValue={s.name} required className={input} />
          </Field>
          <Field label="Localisation">
            <input name="location" defaultValue={s.location} className={input} />
          </Field>
          <Field label="Email de contact">
            <input name="email" type="email" defaultValue={s.email} className={input} />
          </Field>
          <label className="flex items-center gap-3 self-end pb-2">
            <input type="checkbox" name="available" defaultChecked={s.available} className="size-4 accent-[var(--accent)]" />
            <span>Disponible (pastille hero)</span>
          </label>
        </div>
        <Field label="Couleur d'accent">
          <AccentPicker defaultValue={s.accent} />
        </Field>
        <L10nField name="role" label="Rôle" value={s.role} />
        <L10nField name="hero" label="Texte hero" value={s.hero} area />
        <L10nField name="about" label="À propos" value={s.about} area rows={6} />
        <Field label="Réseaux" hint="Une ligne par lien : Label | https://url">
          <textarea
            name="socials"
            rows={4}
            defaultValue={s.socials.map((x) => `${x.label} | ${x.url}`).join("\n")}
            className={`${input} font-mono text-sm`}
          />
        </Field>
        <Field label="CV (PDF)">
          <MediaInput name="cv_url" accept="application/pdf" defaultValue={s.cv_url ? [s.cv_url] : []} />
        </Field>
        <Submit />
      </form>
    </>
  );
}
