/**
 * Generador del CV en PDF (D22). Fuente única: `content.es.ts` (texto rico) +
 * hechos que reproducen es.json. Motor @react-pdf/renderer → texto real
 * seleccionable (ATS), fuentes de marca, cuerpo a una columna.
 *
 *   npx tsx scripts/cv/generate.tsx
 *
 * Salida: public/cv/francisco-lopez-cv-es.pdf
 */
import path from "node:path";
import fs from "node:fs";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  Svg,
  Circle,
  Rect,
  Font,
  StyleSheet,
  renderToFile,
} from "@react-pdf/renderer";
import React from "react";
import { cv as cvEs } from "./content.es";
import { cv as cvEn } from "./content.en";
import type { CV, Job } from "./types";

const ROOT = process.cwd();
const asset = (p: string) => path.join(ROOT, p);
const AVATAR = `data:image/png;base64,${fs.readFileSync(asset("assets/cv/francisco-avatar-rounded.png")).toString("base64")}`;

// --- Marca ---
const C = {
  ink: "#21262B",
  paper: "#F7F3EC", // fondo hueso de marca (--background claro) — online-only
  cyan: "#005E5F", // primary — único color de acción
  purple: "#9B87F5", // decorativo, con cuentagotas (solo chip Exit)
  purpleAccent: "#6D5AC7",
  muted: "#565B62", // texto secundario legible sobre hueso
  border: "#D9D0BE", // divisor sobre hueso (un punto más marcado que sobre blanco)
  cyanSplit: "#16BDBD", // capa de color del logo split (BRAND.md)
  purpleSplit: "#9B87F5",
};

Font.register({ family: "Bricolage", fonts: [{ src: asset("assets/fonts/bricolage-600.woff"), fontWeight: 600 }] });
Font.register({
  family: "Inter",
  fonts: [
    { src: asset("assets/fonts/inter-400.woff"), fontWeight: 400 },
    { src: asset("assets/fonts/inter-600.woff"), fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((w) => [w]); // sin partición de palabras

const s = StyleSheet.create({
  page: {
    backgroundColor: C.paper,
    color: C.ink,
    fontFamily: "Inter",
    fontSize: 9,
    lineHeight: 1.4,
    paddingTop: 30,
    paddingBottom: 26,
    paddingHorizontal: 40,
  },
  // Cabecera
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  headerLeft: { flex: 1, paddingRight: 16 },
  lockup: { flexDirection: "row", alignItems: "center" },
  name: {
    fontFamily: "Bricolage",
    fontWeight: 600,
    fontSize: 25,
    lineHeight: 1.2,
    color: C.ink,
    letterSpacing: -0.3,
    marginLeft: 11,
  },
  role: { fontFamily: "Inter", fontWeight: 600, fontSize: 10.5, color: C.cyan, marginTop: 5 },
  contact: { fontSize: 8.5, color: C.muted, marginTop: 8, lineHeight: 1.5 },
  contactLink: { color: C.muted, textDecoration: "none" },
  avatar: { width: 90, height: 90, borderRadius: 10 },
  headerRule: { height: 2, backgroundColor: C.cyan, marginTop: 10, marginBottom: 2 },

  // Secciones
  section: { marginTop: 6 },
  sectionDivider: { borderTopWidth: 1, borderTopColor: C.border, marginBottom: 5 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  sectionAccent: { width: 12, height: 3, backgroundColor: C.cyan, marginRight: 7 },
  sectionTitle: { fontFamily: "Bricolage", fontWeight: 600, fontSize: 12.5, color: C.ink },

  summary: { fontSize: 9.5, lineHeight: 1.42, color: C.ink },

  // Hitos
  milestone: { flexDirection: "row", marginBottom: 2.5, alignItems: "flex-start" },
  mYear: { fontFamily: "Bricolage", fontWeight: 600, fontSize: 9.5, color: C.cyan, width: 30 },
  mText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
  mCompany: { fontFamily: "Inter", fontWeight: 600 },
  chip: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 7,
    color: C.purpleAccent,
    borderWidth: 1,
    borderColor: C.purple,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 5,
  },

  // Experiencia
  job: { marginBottom: 4.5 },
  jobHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  jobHeadLeft: { flex: 1, paddingRight: 10 },
  jobCompany: { fontFamily: "Bricolage", fontWeight: 600, fontSize: 10.5, color: C.ink },
  jobRole: { fontFamily: "Inter", fontWeight: 600, fontSize: 9, color: C.ink },
  jobContext: { fontSize: 9, color: C.muted },
  jobPeriod: { fontSize: 8.5, color: C.muted, fontFamily: "Inter" },
  jobMeta: { fontSize: 8, color: C.muted, marginTop: 1, marginBottom: 2.5 },
  bulletRow: { flexDirection: "row", marginBottom: 1.4, paddingRight: 2 },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.cyan, marginTop: 4.2, marginRight: 6 },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.36, color: C.ink },

  previousIntro: { fontSize: 9, color: C.muted, marginBottom: 6, lineHeight: 1.42 },

  // Formación / Habilidades
  twoCol: { flexDirection: "row" },
  col: { flex: 1, paddingRight: 14 },
  eduItem: { marginBottom: 3.5 },
  eduTitle: { fontFamily: "Inter", fontWeight: 600, fontSize: 9.5, color: C.ink },
  eduInst: { fontSize: 8.5, color: C.muted, marginTop: 0.5 },
  skillRow: { flexDirection: "row", marginBottom: 3 },
  skillLabel: { fontFamily: "Inter", fontWeight: 600, fontSize: 9, color: C.ink, width: 118 },
  skillValue: { flex: 1, fontSize: 9, color: C.ink, lineHeight: 1.4 },
  // Igual que skillLabel: tinta en negrita, no cian. El cian es el color de acción
  // (BRAND.md); estas etiquetas de categoría no son acciones y deben leerse como las
  // de Habilidades.
  toolLabel: { fontFamily: "Inter", fontWeight: 600, fontSize: 9, color: C.ink, width: 118 },
});

function LogoMark({ size = 42 }: { size?: number }) {
  // Símbolo split en color, geometría de scripts/logo-kit (canvas 120). El split
  // solo se lee a ≥48px (BRAND.md, regla 1); a este tamaño en el lockup se
  // aprecia como halo de color deliberado. viewBox recortado a la tinta+color.
  const h = size;
  const w = (64 / 72) * size;
  return (
    <Svg viewBox="28 15 64 72" width={w} height={h}>
      <Circle cx={57} cy={44} r={26} stroke={C.cyanSplit} strokeWidth={6} fill="none" />
      <Circle cx={63} cy={48} r={26} stroke={C.purpleSplit} strokeWidth={6} fill="none" />
      <Circle cx={60} cy={46} r={26} stroke={C.ink} strokeWidth={6} fill="none" />
      <Rect x={42} y={82} width={36} height={5} rx={2.5} fill={C.ink} />
    </Svg>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View style={s.sectionTitleRow}>
      <View style={s.sectionAccent} />
      <Text style={s.sectionTitle}>{children}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <View style={s.sectionDivider} />
      <SectionTitle>{title}</SectionTitle>
      {children}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((b, i) => (
        <View style={s.bulletRow} key={i}>
          <View style={s.bulletDot} />
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
    </>
  );
}

function JobBlock({ job }: { job: Job }) {
  return (
    <View style={s.job} wrap={false}>
      <View style={s.jobHead}>
        <Text style={s.jobHeadLeft}>
          <Text style={s.jobCompany}>{job.company}</Text>
          {job.project ? <Text style={s.jobContext}>{"  ·  " + job.project}</Text> : null}
          {"\n"}
          <Text style={s.jobRole}>{job.role}</Text>
          {job.context ? <Text style={s.jobContext}>{"  ·  " + job.context}</Text> : null}
        </Text>
        <Text style={s.jobPeriod}>{job.period}</Text>
      </View>
      {job.reporting ? <Text style={s.jobMeta}>{job.reporting}</Text> : null}
      <Bullets items={job.bullets} />
    </View>
  );
}

function Cv({ data, lang }: { data: CV; lang: "es" | "en" }) {
  return (
    <Document title={`${data.name} — CV`} author={data.name} subject={data.subject} language={lang}>
      <Page size="A4" style={s.page}>
        {/* Cabecera */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.lockup}>
              <LogoMark size={40} />
              <Text style={s.name}>{data.name}</Text>
            </View>
            <Text style={s.role}>{data.role}</Text>
            <Text style={s.contact}>
              <Link src={`mailto:${data.contact.email}`} style={s.contactLink}>
                {data.contact.email}
              </Link>
              {"   ·   "}
              <Link src={`tel:+34${data.contact.phone.replace(/\s/g, "")}`} style={s.contactLink}>
                {data.contact.phone}
              </Link>
              {"\n"}
              <Link src={`https://${data.contact.web}`} style={s.contactLink}>
                {data.contact.web}
              </Link>
              {"   ·   "}
              <Link src={`https://${data.contact.linkedin}`} style={s.contactLink}>
                {data.contact.linkedin}
              </Link>
              {"   ·   "}
              {data.contact.location}
            </Text>
          </View>
          <Image style={s.avatar} src={AVATAR} />
        </View>
        <View style={s.headerRule} />

        {/* Perfil */}
        <View style={s.section}>
          <SectionTitle>{data.ui.profile}</SectionTitle>
          <Text style={s.summary}>{data.summary}</Text>
        </View>

        {/* Hitos */}
        <Section title={data.ui.milestones}>
          {data.milestones.map((m, i) => (
            <View style={s.milestone} key={i}>
              <Text style={s.mYear}>{m.year}</Text>
              <Text style={s.mText}>
                <Text style={s.mCompany}>{m.company}</Text>
                {"  —  " + m.impact}
                {m.exit ? <Text style={s.chip}> Exit </Text> : null}
              </Text>
            </View>
          ))}
        </Section>

        {/* Experiencia */}
        <Section title={data.ui.experience}>
          {data.experience.map((j, i) => (
            <JobBlock job={j} key={i} />
          ))}
        </Section>

        {/* Experiencia previa */}
        <Section title={data.ui.previous}>
          <Text style={s.previousIntro}>{data.previous.intro}</Text>
          {data.previous.roles.map((j, i) => (
            <JobBlock job={j} key={i} />
          ))}
        </Section>

        {/* Formación */}
        <Section title={data.ui.education}>
          <View style={s.twoCol}>
            <View style={s.col}>
              {data.education.slice(0, 2).map((e, i) => (
                <View style={s.eduItem} key={i}>
                  <Text style={s.eduTitle}>{e.title}</Text>
                  <Text style={s.eduInst}>{e.institution}</Text>
                </View>
              ))}
            </View>
            <View style={s.col}>
              {data.education.slice(2).map((e, i) => (
                <View style={s.eduItem} key={i}>
                  <Text style={s.eduTitle}>{e.title}</Text>
                  <Text style={s.eduInst}>{e.institution}</Text>
                </View>
              ))}
            </View>
          </View>
        </Section>

        {/* Habilidades */}
        <Section title={data.ui.skills}>
          {data.skills.map((sk, i) => (
            <View style={s.skillRow} key={i}>
              <Text style={s.skillLabel}>{sk.label}</Text>
              <Text style={s.skillValue}>{sk.value}</Text>
            </View>
          ))}
        </Section>

        {/* Toolkit */}
        <Section title={data.ui.toolkit}>
          {data.tools.map((t, i) => (
            <View style={s.skillRow} key={"t" + i}>
              <Text style={s.toolLabel}>{t.label}</Text>
              <Text style={s.skillValue}>{t.names.join("  ·  ")}</Text>
            </View>
          ))}
        </Section>
      </Page>
    </Document>
  );
}

const LOCALES: { lang: "es" | "en"; data: CV }[] = [
  { lang: "es", data: cvEs },
  { lang: "en", data: cvEn },
];

async function main() {
  let failures = 0;
  for (const { lang, data } of LOCALES) {
    const out = asset(`public/cv/francisco-lopez-cv-${lang}.pdf`);
    try {
      await renderToFile(<Cv data={data} lang={lang} />, out);
      console.log("CV generado →", out);
    } catch (e) {
      failures++;
      console.error(`Error generando ${lang} (¿PDF abierto en un visor?):`, (e as Error).message);
    }
  }
  if (failures) process.exit(1);
}

main().catch((e) => {
  console.error("Error generando el CV:", e);
  process.exit(1);
});
