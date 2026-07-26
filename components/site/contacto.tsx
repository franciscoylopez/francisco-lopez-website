import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { LinkedinIcon } from "./icons";

export type ContactoDict = {
  eyebrow: string;
  title: string;
  intro: string;
  emailLabel: string;
  phoneLabel: string;
  linkedinLabel: string;
  cvLabel: string;
  cvValue: string;
};

const EMAIL = "franciscojavier.lopezmartinez@gmail.com";
const PHONE_TEL = "+34629832720";
const PHONE_DISPLAY = "629 832 720";
const LINKEDIN_URL = "https://www.linkedin.com/in/franciscolopez1975/";
const LINKEDIN_DISPLAY = "linkedin.com/in/franciscolopez1975";

function Row({
  href,
  external,
  download,
  icon,
  label,
  value,
  valueClassName,
}: {
  href: string;
  external?: boolean;
  download?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="contact-row contact-grid border-border text-foreground rounded-md border-b py-[clamp(1.3rem,3vw,1.75rem)] no-underline"
    >
      <span
        aria-hidden="true"
        className="border-border text-foreground flex h-10 w-10 flex-none items-center justify-center rounded-md border [grid-area:ic]"
      >
        {icon}
      </span>
      <span className="font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.2] font-semibold tracking-[-0.01em] [grid-area:lb]">
        {label}
      </span>
      <span
        className={
          "contact-val text-muted-foreground text-[0.95rem] [grid-area:vl] " +
          (valueClassName ?? "")
        }
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className="contact-arrow text-muted-foreground justify-self-end [grid-area:ar]"
      >
        <ArrowUpRight className="size-[18px]" />
      </span>
    </a>
  );
}

// Contacto (PRD §8.5/§21). Cuatro filas clicables (email/tel/LinkedIn/CV) — el clic
// en email es la métrica primaria (§9). Estados hover/foco en CSS (.contact-row).
export function Contacto({
  dict,
  cvHref,
}: {
  dict: ContactoDict;
  cvHref: string;
}) {
  const iconCls = "size-[18px]";
  return (
    <section
      id="contacto"
      className="border-border border-t py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--page-x)]">
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <p className="text-muted-foreground m-0 mb-3 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
            {dict.eyebrow}
          </p>
          <h2 className="font-display m-0 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.022em]">
            {dict.title}
          </h2>
          <p className="text-muted-foreground mt-[1.4rem] text-[1.05rem] leading-[1.6]">
            {dict.intro}
          </p>
        </div>

        <div data-reveal className="border-border border-t">
          <Row
            href={`mailto:${EMAIL}`}
            icon={<Mail className={iconCls} />}
            label={dict.emailLabel}
            value={EMAIL}
          />
          <Row
            href={`tel:${PHONE_TEL}`}
            icon={<Phone className={iconCls} />}
            label={dict.phoneLabel}
            value={PHONE_DISPLAY}
            valueClassName="[font-variant-numeric:tabular-nums]"
          />
          <Row
            href={LINKEDIN_URL}
            external
            icon={<LinkedinIcon className={iconCls} />}
            label={dict.linkedinLabel}
            value={LINKEDIN_DISPLAY}
          />
          <Row
            href={cvHref}
            download
            icon={<Download className={iconCls} />}
            label={dict.cvLabel}
            value={dict.cvValue}
          />
        </div>
      </div>
    </section>
  );
}
