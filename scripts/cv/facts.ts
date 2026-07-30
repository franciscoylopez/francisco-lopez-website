// Hechos del CV leídos del diccionario i18n (single-source, D22): periodos,
// roles, formación y toolkit NO se autoran en content.{es,en}.ts, se derivan de
// aquí para que web y CV no diverjan. `es.json` es la fuente; el CV EN hereda los
// hechos ya traducidos de `en.json` (periodos "Present", formación en inglés…).

import fs from "node:fs";
import path from "node:path";
import type { EducationItem, ToolRow } from "./types";

// Forma mínima del diccionario que consume el CV (solo los campos que usa).
interface DictJob {
  period: string;
  role: string;
  company: string;
}
interface DictFacts {
  trayectoria: {
    producto: DictJob[];
    nested: DictJob[];
    previo: DictJob[];
    shutappTitle: string;
  };
  formacion: {
    producto: EducationItem[];
    marketing: EducationItem[];
  };
  toolkit: {
    categories: { label: string; tools: { name: string }[] }[];
  };
}

export function loadDict(lang: "es" | "en"): DictFacts {
  const p = path.join(process.cwd(), "app", "[lang]", "dictionaries", `${lang}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8")) as DictFacts;
}

// Formación: Producto (bootcamps) + Marketing (máster/grado), en ese orden —
// el layout a dos columnas del CV parte por la mitad.
export function buildEducation(dict: DictFacts): EducationItem[] {
  return [...dict.formacion.producto, ...dict.formacion.marketing];
}

// Toolkit: categoría + nombres (sin las descripciones de la web, decisión G).
export function buildTools(dict: DictFacts): ToolRow[] {
  return dict.toolkit.categories.map((c) => ({
    label: c.label,
    names: c.tools.map((t) => t.name),
  }));
}

export interface FactRow {
  company: string;
  role: string;
  period: string;
  project?: string;
}

// Filas de experiencia (Producto + Shutapp anidados) y previa, con el proyecto
// paraguas resuelto para los roles anidados.
export function experienceFacts(dict: DictFacts): FactRow[] {
  return [
    ...dict.trayectoria.producto.map((j) => ({ company: j.company, role: j.role, period: j.period })),
    ...dict.trayectoria.nested.map((j) => ({
      company: j.company,
      role: j.role,
      period: j.period,
      project: dict.trayectoria.shutappTitle,
    })),
  ];
}

export function previousFacts(dict: DictFacts): FactRow[] {
  return dict.trayectoria.previo.map((j) => ({ company: j.company, role: j.role, period: j.period }));
}

// Une un rol autorado (por su clave `company`) con sus hechos del diccionario.
// El diccionario puede llevar la empresa más descriptiva (p. ej. "Ontecnia
// (Malavida…)"): se une por prefijo. Lanza si no hay match — así, si un cambio
// futuro rompe la correspondencia web↔CV, salta en la generación en vez de en
// silencio.
export function matchFact(rows: FactRow[], company: string): FactRow {
  const hit = rows.find((r) => r.company === company || r.company.startsWith(company));
  if (!hit) {
    throw new Error(
      `CV: no encuentro los hechos de "${company}" en el diccionario (trayectoria). ` +
        `¿Cambió el nombre de la empresa en es.json/en.json? Empresas disponibles: ${rows
          .map((r) => r.company)
          .join(" · ")}`,
    );
  }
  return hit;
}
