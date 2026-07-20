import type { LegalSection } from "@/components/site/legal-doc";

const UPDATED = "1 July 2026";

interface LegalDocData {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const legalDocs: Record<"privacy" | "terms" | "consent" | "disclaimer", LegalDocData> = {
  privacy: {
    title: "Privacy notice",
    updated: UPDATED,
    intro:
      "This notice explains how KAPT handles information submitted through the KAPT Digital Clinic diagnostic gateway. It is a placeholder to be finalised by KOBIS Berhad.",
    sections: [
      { heading: "What we collect", body: ["We collect the details you provide in the diagnostic form: your name, work email, mobile number, position, organisation details, your description of the challenge, and any files or links you choose to share.", "We also record a submission timestamp, a one-way hashed indicator of your network address for security, and your browser type. We do not store your raw IP address."] },
      { heading: "Why we use it", body: ["Information is used only to review your submission, prepare an initial digital diagnosis, and contact you about it. We do not sell your data or use it for unrelated marketing."] },
      { heading: "Please do not send sensitive data", body: ["The public form is not a secure channel. Please do not submit classified, restricted, confidential, personal, medical, financial, or legally protected information. We can arrange a more secure process where required."] },
      { heading: "Who can see it", body: ["Submissions are accessible to authorised KAPT team members for the purpose of review and response. Access is controlled by role-based authentication and recorded in an internal audit log."] },
      { heading: "Retention", body: ["We keep submission records for as long as needed to support the enquiry and any resulting engagement, then review them for deletion in line with our retention practices."] },
      { heading: "Your choices", body: ["You may ask us to correct or delete your submission by contacting us with your reference number. Some records may be retained where required for legitimate business or legal reasons."] },
    ],
  },
  terms: {
    title: "Terms of submission",
    updated: UPDATED,
    intro:
      "These terms apply when you submit a challenge through the KAPT Digital Clinic. They are a placeholder to be finalised by KOBIS Berhad.",
    sections: [
      { heading: "Nature of the service", body: ["The initial diagnosis is a preliminary, good-faith assessment based on the information you provide. It is not a formal proposal, quotation, technical specification, or professional advice, and it does not create any contractual relationship."] },
      { heading: "Your responsibilities", body: ["You confirm that the information you submit is accurate to the best of your knowledge, that you are authorised to share it, and that it contains no confidential or classified material that should not be sent through a public form."] },
      { heading: "No obligation", body: ["Requesting a diagnosis places no obligation on you or on KAPT. Any formal engagement will be governed by a separate written agreement covering scope, pricing, security, and governance."] },
      { heading: "Acceptable use", body: ["You agree not to misuse the form, submit unlawful content, upload malicious files, or attempt to disrupt the service. We may decline or remove submissions that breach these terms."] },
      { heading: "Changes", body: ["We may update these terms from time to time. The version shown at the time of your submission applies to that submission."] },
    ],
  },
  consent: {
    title: "Data consent",
    updated: UPDATED,
    intro:
      "This explains the consent you give when you submit a challenge. It is a placeholder to be finalised by KOBIS Berhad.",
    sections: [
      { heading: "What you consent to", body: ["By ticking the consent box and submitting, you agree that KAPT may review the information you provide in order to prepare an initial digital diagnosis and to contact you about it."] },
      { heading: "Consent is recorded", body: ["We record the consent text, the time of consent, and your submission reference so there is a clear record of what you agreed to."] },
      { heading: "Withdrawing consent", body: ["You may withdraw consent and request deletion of your submission by contacting us with your reference number. Withdrawal does not affect processing that has already taken place."] },
      { heading: "Confidential information", body: ["Consent through this form does not extend to confidential or classified information. For sensitive matters, we will agree a separate, secure arrangement before you share such material."] },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    updated: UPDATED,
    intro:
      "This disclaimer applies to the initial diagnosis and all content on the KAPT Digital Clinic. It is a placeholder to be finalised by KOBIS Berhad.",
    sections: [
      { heading: "Preliminary guidance only", body: ["Any diagnosis, recommendation, feature suggestion, timeline, or budget indication is preliminary and illustrative. It is provided to help you understand possible directions, not as a commitment or guarantee."] },
      { heading: "AI-assisted analysis", body: ["Our team may use AI tools to support internal analysis. Every response sent to you is reviewed and prepared by a person. We do not send uncontrolled automated answers."] },
      { heading: "Estimates and outcomes", body: ["Actual scope, cost, timeline, and outcomes depend on detailed requirements, integration, security, data sensitivity, support needs, and governance, and will differ from any early indication."] },
      { heading: "No liability for reliance", body: ["To the extent permitted by law, KAPT and KOBIS Berhad accept no liability for decisions made in reliance on a free initial diagnosis. Formal engagements are governed by their own agreements."] },
    ],
  },
};
