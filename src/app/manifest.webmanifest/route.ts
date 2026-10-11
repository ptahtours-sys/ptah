import { getSettings } from "@/server/settings";

/**
 * Public web app manifest — served at /manifest.webmanifest.
 *
 * This is a route handler (not the app/manifest.ts file convention) ON PURPOSE.
 * The app uses MULTIPLE ROOT LAYOUTS (public [lang], admin, maintenance). The
 * manifest.ts convention auto-injects a <link rel="manifest"> app-wide, which
 * leaked the PUBLIC manifest onto admin pages even though the admin root sets its
 * own `metadata.manifest` — so installing from the admin area produced the public
 * "Ptah Tours" app instead of "Ptah … Admin" (both installed the same app).
 *
 * Serving the manifest explicitly (same URL, /manifest.webmanifest) means there
 * is NO app-wide auto-injection: each root layout links exactly one manifest via
 * `metadata.manifest` — the public [lang] layout → this file, the admin layout →
 * /admin.webmanifest. Result: two cleanly separate installable PWAs.
 *
 * Distinct identity: id/scope "/" here vs "/admin" there (a manifest `id` IS the
 * PWA's identity). Reads DB-driven branding (getSettings never throws).
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const s = await getSettings();
  const name = s["branding.siteName"];
  const theme = s["seo.themeColor"];
  // short_name stays ~12 chars (home-screen label): full name if it fits, else
  // the first word, hard-capped so a long single word can't overflow the label.
  const shortName = (name.length <= 12 ? name : name.split(/\s+/)[0]).slice(0, 12);

  const manifest = {
    id: "/",
    name,
    short_name: shortName,
    description: s["branding.tagline"],
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: theme,
    theme_color: theme,
    lang: "en",
    dir: "ltr",
    categories: ["travel", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store",
    },
  });
}
