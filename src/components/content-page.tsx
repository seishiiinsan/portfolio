import type { Dict, Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Page, Settings } from "@/lib/types";
import { PageTransition } from "./page-transition";
import { Reveal, Rule, SplitText } from "./reveal";
import { Footer } from "./footer";
import { Prose } from "./markdown";

/** Page éditoriale simple (Now, Uses, Studio) éditée depuis l'admin. */
export function ContentPage({ page, s, dict, locale, label }: { page: Page; s: Settings; dict: Dict; locale: Locale; label: string }) {
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(page.updated_at));
  return (
    <PageTransition>
      <div>
        <section className="px-4 pt-36 pb-24 md:px-8 md:pt-48">
          <div className="mb-4 flex justify-between font-mono text-xs uppercase text-muted">
            <span>({label})</span>
            <span>{updated}</span>
          </div>
          <Rule />
          <SplitText
            as="h1"
            by="word"
            text={t(page.title, locale)}
            className="mt-8 mb-16 text-[15vw] leading-[0.85] font-medium tracking-[-0.06em] md:text-[10vw]"
          />
          <div className="grid md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-7 md:col-start-6">
              <Prose>{t(page.content, locale)}</Prose>
            </Reveal>
          </div>
        </section>
        <Footer s={s} dict={dict} locale={locale} />
      </div>
    </PageTransition>
  );
}
