/**
 * Global header — RSC wrapper (reads the content module + branding settings
 * once at request time) + a single client island (SiteHeaderChrome) owning all
 * interactive chrome. The header logo + site name are DB-driven (Phase 7 S3):
 * an admin-set logo overrides the built-in cartouche SVG wordmark.
 */
import type { JSX } from "react";
import SiteHeaderChrome from "@/components/site/SiteHeaderChrome";
import { getSettings } from "@/server/settings";
import { getMedia } from "@/server/media";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeSiteNav, headerStrings } from "@/i18n/chrome";

export async function SiteHeader(): Promise<JSX.Element> {
  const [settings, dict] = await Promise.all([getSettings(), getDictionary()]);
  const logoId = settings["branding.logoMediaId"];
  // Explicit intrinsic dimensions let the logo reserve its box before load (no CLS).
  const logo = logoId ? await getMedia(logoId).catch(() => null) : null;
  return (
    <SiteHeaderChrome
      nav={localizeSiteNav(dict)}
      t={headerStrings(dict)}
      logoSrc={logoId ? `/api/media/${logoId}` : null}
      logoWidth={logo?.width ?? null}
      logoHeight={logo?.height ?? null}
      siteName={settings["branding.siteName"]}
    />
  );
}

export default SiteHeader;
