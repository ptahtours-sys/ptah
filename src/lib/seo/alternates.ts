import type { Metadata } from "next";
import { locales, localeHtmlLang, defaultLocale, toLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

/**
 * Locale-aware canonical + hreflang alternates for a locale-agnostic path.
 *
 * Every public URL is locale-prefixed (`/en/visa`, `/ar/visa`, …) and the proxy
 * redirects the bare form (`/visa`). A canonical of `/visa` therefore pointed at
 * a redirect, and all seven language versions claimed the SAME canonical —
 * which Search Console reports as "Duplicate without user-selected canonical" /
 * "Google chose different canonical". Each locale now self-canonicalizes and
 * lists its siblings via hreflang (+ x-default → default locale).
 */
export function localeAlternates(path: string, lang: string): NonNullable<Metadata["alternates"]> {
  const locale = toLocale(lang);
  const languages: Record<string, string> = {};
  for (const loc of locales) languages[localeHtmlLang[loc]] = localizePath(path, loc);
  languages["x-default"] = localizePath(path, defaultLocale);
  return { canonical: localizePath(path, locale), languages };
}
