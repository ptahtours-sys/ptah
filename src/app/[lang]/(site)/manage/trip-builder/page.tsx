import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TripBuilder from "@/components/trip/TripBuilder";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import { localeAlternates } from "@/lib/seo/alternates";

export const dynamic = "force-dynamic";

const baseMetadata: Metadata = {
  title: "Trip Builder | Ptah Tours",
  description:
    "Build your Egypt trip: bookmark the tours you like, gather them in one place, and send us your shortlist to shape into a single private itinerary.",
};

export default async function TripBuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [{ tab }, tours, user, pc] = await Promise.all([
    searchParams,
    listPublishedTours(undefined, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const t = pc.tripBuilder;
  const initialTab = tab === "bookmarks" ? "bookmarks" : "plan";

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumbTitle }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.intro}</p>
      </header>

      <div className="mt-12">
        <TripBuilder tours={tours} isAuthenticated={user !== null} initialTab={initialTab} labels={t} />
      </div>
    </Container>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { ...baseMetadata, alternates: localeAlternates("/manage/trip-builder", lang) };
}
