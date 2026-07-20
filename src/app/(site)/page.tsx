import { getSiteContent } from "@/lib/content.server";
import { Hero } from "@/components/home/hero";
import { MagicBox } from "@/components/home/magic-box";
import { Services } from "@/components/home/services";
import { BringChallenge } from "@/components/home/bring-challenge";
import { Receive } from "@/components/home/receive";
import { HowItWorks } from "@/components/home/how-it-works";
import { Expectations } from "@/components/home/expectations";
import { Ecosystem } from "@/components/home/ecosystem";
import { Experience } from "@/components/home/experience";
import { Trust } from "@/components/home/trust";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";

export default async function HomePage() {
  const c = await getSiteContent();
  return (
    <>
      <Hero content={c.hero} />
      <MagicBox content={c.magicBox} />
      <Services content={c.services} />
      <BringChallenge content={c.bringChallenge} />
      <Receive content={c.receive} />
      <HowItWorks content={c.howItWorks} />
      <Expectations content={c.expectations} />
      <Ecosystem content={c.ecosystem} />
      <Experience content={c.experience} />
      <Trust content={c.trust} />
      <Faq content={c.faq} />
      <FinalCta content={c.finalCta} />
    </>
  );
}
