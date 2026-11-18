import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import TrackBookingForm from "@/components/site/TrackBookingForm";
import { getPageContent } from "@/i18n/pages";
import { localeAlternates } from "@/lib/seo/alternates";

const baseMetadata: Metadata = {
  title: "Track your booking | Ptah Tours",
  description:
    "Look up your Ptah Tours booking by reference and the email you booked with to see its latest status.",
};

export default async function TrackBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const pc = await getPageContent();
  const t = pc.trackBooking;

  return (
    <Container className="py-16">
      <div className="mx-auto mb-8 max-w-xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rust">
          {t.eyebrow}
        </p>
        <h1 className="mt-3 text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">
          {t.intro}
        </p>
      </div>
      <TrackBookingForm defaultReference={ref ?? ""} labels={t} />
    </Container>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { ...baseMetadata, alternates: localeAlternates("/track-booking", lang) };
}
