import { defaultContent } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { MagicBox } from "@/components/home/magic-box";
import { Services } from "@/components/home/services";
import { HowItWorks } from "@/components/home/how-it-works";
import { Expectations } from "@/components/home/expectations";
import { Trust } from "@/components/home/trust";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Deliberately lean funnel: land → describe → understand how it works → why
 * KAPT → trust → a couple of questions → one clear action. Static demo build
 * uses the default content set (the CMS override layer is a backend concern).
 */
export default function HomePage() {
  const c = defaultContent;
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
