import type { Metadata } from "next";

import { ContactoPagina } from "@/components/site/contacto-pagina";
import { PageShell } from "@/components/site/page-shell";
import { EMAIL, PHONE_TEL } from "@/lib/contact";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { contactPageLd } from "@/lib/structured-data";
import { getCommon, getContacto } from "../dictionaries";

const SLUG = "contacto";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  return metadataDePagina(params, SLUG, getContacto);
}

export default async function ContactoPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(params, getCommon, getContacto);

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
