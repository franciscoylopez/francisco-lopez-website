import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactoPagina } from "@/components/site/contacto-pagina";
import { PageShell } from "@/components/site/page-shell";
import { EMAIL, PHONE_TEL } from "@/lib/contact";
import { locales, isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { contactPageLd } from "@/lib/structured-data";
import { getCommon, getContacto } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

const SLUG = "contacto";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getContacto(lang);
  return pageMetadata({ lang, slug: SLUG, meta: t.meta });
}

export default async function ContactoPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([getCommon(lang), getContacto(lang)]);

  return (
    <PageShell
      dict={common}
      lang={lang}
      crumb={t.crumb}
      extraLd={contactPageLd({
        lang,
        name: t.title,
        description: t.meta.description,
        email: EMAIL,
        telephone: PHONE_TEL,
      })}
    >
      <ContactoPagina dict={t} breadcrumb={common.breadcrumb} lang={lang} />
    </PageShell>
  );
}
