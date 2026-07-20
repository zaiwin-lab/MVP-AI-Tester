import { getSiteContent } from "@/lib/content.server";
import { Hero } from "@/components/home/hero";
import { MagicBox } from "@/components/home/magic-box";
import { Services } from "@/components/home/services";
import { HowItWorks } from "@/components/home/how-it-works";
import { Expectations } from "@/components/home/expectations";
import { Trust } from "@/components/home/trust";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

// Rendered at request time so editable content (and Netlify Blobs) is read in
// the serverless runtime, never during the build.
export const dynamic = "force-dynamic";

/**
 * Deliberately lean funnel: land → describe → understand how it works → why
 * KAPT → trust → a couple of questions → one clear action. Fuller sections
 * (example solutions, AI ecosystem, the full "what you receive" list) live in
 * the components library and on /demo, kept off the homepage to reduce load.
 */
export default async function HomePage() {
  const c = await getSiteContent();
  return (
    <>
      <Hero content={c.hero} />
      <MagicBox content={c.magicBox} />
      <Services content={c.services} />
      <HowItWorks content={c.howItWorks} />
      <Expectations content={c.expectations} />
      <Trust content={c.trust} />
      <Faq content={c.faq} />
      <FinalCta content={c.finalCta} />
    </>
  );
}
