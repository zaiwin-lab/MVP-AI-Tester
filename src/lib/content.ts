/**
 * Editable site content (pure data — safe to import from client components).
 *
 * This is the default content set. The admin Content module writes overrides
 * to the `content` collection which are merged on top at render time by
 * `getSiteContent` in `content.server.ts` (kept separate so the node-backed
 * data layer never leaks into the client bundle). Keeping copy here rather
 * than inline in components is what makes the site CMS-editable and, later,
 * translatable via locale files.
 */

export const siteMeta = {
  brand: "CAP Digital Clinic",
  parent: "KOBIS Berhad",
  reference: "CAP Digital Clinic by KOBIS Berhad",
  tagline: "Digital Solution Diagnostic Gateway",
  motto: "Smart Digital Solutions. Sustainable Impact.",
  responseWindow: "24 hours",
  // Editable placeholders — do not invent real contact details.
  email: "hello@kobis.example",
  phone: "+60 0-000 0000",
  website: "www.kobis.example",
};

export const defaultContent = {
  hero: {
    kicker: "CAP · KOBIS AI Prodigy Team",
    headline: "Not sure what digital solution you need?",
    subhead:
      "You do not need a technical brief or a system name. Tell our CAP team what is slowing your organisation down. We review it and recommend a practical digital direction.",
    primaryCta: "Describe my challenge",
    secondaryCta: "See what we help with",
    trust: "Free initial diagnosis. No obligation. Response within 24 hours.",
  },

  magicBox: {
    heading: "Tell us what is happening",
    sub: "Write it naturally. Explain the issue exactly as you would to a colleague. There is no wrong way to describe it.",
    placeholderExamples: [
      "Our reporting process takes too long.",
      "We manage hundreds of participants by hand.",
      "Our team runs everything across too many WhatsApp groups.",
      "We want clearer visibility of project progress.",
      "We have an idea but do not know what system to build.",
      "We want to use AI but do not know where to begin.",
    ],
    helperToggle: "Help me structure my problem",
    helperPrompts: [
      "What is the current process?",
      "Who is involved?",
      "What is not working well?",
      "How often does the issue happen?",
      "How many users or participants are involved?",
      "What result would you like to achieve?",
      "Is there an important deadline?",
      "Have you tried any solution before?",
    ],
    cta: "Continue to the diagnostic form",
  },

  services: {
    heading: "What CAP can help with",
    sub: "We begin with the outcome you want, not a product name. These are the areas organisations most often bring to us.",
    items: [
      { title: "Programme & participant management", body: "Register, track, and support large groups of people without spreadsheets and message threads." },
      { title: "Reporting & monitoring dashboards", body: "Turn scattered updates into one clear view of progress, status, and results." },
      { title: "Event & attendance systems", body: "Handle registration, QR check-in, and live attendance across sessions and venues." },
      { title: "AI-assisted analysis & decision support", body: "Use AI responsibly to summarise, compare, and surface what matters for a decision." },
      { title: "Document, proposal & application workflows", body: "Move submissions through intake, review, and approval with a clear trail." },
      { title: "Cooperative & organisational management", body: "Keep members, board documents, meetings, and applications in one governed place." },
      { title: "Community outreach & engagement", body: "Reach, register, and stay in contact with the communities you serve." },
      { title: "Websites, portals & digital ecosystems", body: "Public information and secure member areas that work well on a phone." },
      { title: "Secretariat, PMO & project coordination", body: "Coordinate tasks, milestones, and reporting for programmes and committees." },
      { title: "Internal workflow automation", body: "Remove repeated manual steps between the tools your team already uses." },
      { title: "Training & facilitation technology", body: "Support trainers and participants before, during, and after a programme." },
      { title: "Custom digital prototypes", body: "Test an idea quickly with a working prototype before committing to a full build." },
    ],
  },

  bringChallenge: {
    heading: "You bring the challenge. We help define the solution.",
    body: "Many organisations know a process is slow, repetitive, fragmented, or hard to monitor, yet they cannot say whether the answer is a dashboard, a portal, an automation, an AI assistant, a registration system, a reporting platform, or simply a redesigned workflow. That is normal. CAP starts with the problem, not the software.",
    flow: ["Challenge", "Diagnosis", "Recommended direction", "Consultation or pilot", "Development"],
  },

  receive: {
    heading: "What your initial diagnosis may include",
    note: "The level of detail depends on the information you share. A free diagnosis is an informed direction, not a full technical specification.",
    items: [
      "A summary of the issue in plain terms",
      "An initial assessment of the root problem",
      "Possible digital opportunities",
      "A recommended solution direction",
      "Suggested features or workflow",
      "Proposed implementation stages",
      "A potential pilot approach",
      "An early budget indication where appropriate",
      "A recommended next discussion",
    ],
  },

  howItWorks: {
    heading: "How it works",
    steps: [
      { title: "Describe the challenge", body: "Share the issue, idea, or ambition in your own words. Add files if they help." },
      { title: "CAP reviews it", body: "Our team reads the submission and, where useful, uses AI to support internal analysis." },
      { title: "Receive a diagnosis", body: `You get an initial digital diagnosis by email, usually within ${siteMeta.responseWindow}.` },
      { title: "Decide the next step", body: "Continue with a consultation, pilot, proposal, or full development. Only if it is right for you." },
    ],
  },

  expectations: {
    heading: "Digital delivery has changed. Expectations should change too.",
    intro:
      "With the steady advance of artificial intelligence, cloud platforms, automation, and modern low-code tools, organisations can reasonably expect more from a digital solution provider.",
    pillars: [
      { title: "Better quality", body: "AI-assisted research, design, development, documentation, and review can raise the quality and completeness of many digital projects." },
      { title: "Greater impact", body: "A solution should not only look modern. It should improve process, reporting, engagement, decisions, speed, and outcomes." },
      { title: "Faster delivery", body: "Work that once needed long development cycles can often be designed, tested, and deployed more efficiently through modern workflows." },
      { title: "More efficient cost", body: "For suitable project scopes, AI-assisted development and reusable components can reduce development effort and overall cost." },
    ],
    caveat:
      "Every project remains subject to scope, security, integration, complexity, support requirements, data sensitivity, and governance. We do not promise the same saving on every engagement.",
  },

  ecosystem: {
    heading: "Human expertise, strengthened by multiple AI platforms",
    body: "CAP combines human judgement, consultation, facilitation, industry experience, and project management with a broad AI-enabled working environment. Depending on the project, our team may draw on a combination of leading AI, cloud, automation, documentation, and development platforms.",
    tools: ["OpenAI GPT", "Claude", "Gemini", "Kimi", "Grok", "Obsidian", "Cloud platforms", "Modern web tooling", "Automation tools", "Research & knowledge systems"],
    closing: "The technology is not the product. The solution is.",
  },

  experience: {
    heading: "Example solution directions",
    note: "Illustrative examples only, shown without confidential detail. Replace with your own KOBIS case studies in the admin content module.",
    items: [
      { challenge: "Thousands of programme participants tracked by form, chat, and spreadsheet.", direction: "Centralised participant portal with attendance, progress dashboard, and automated reporting.", outcome: "Faster reporting and a single reliable view of every participant." },
      { challenge: "An agency receives many proposals and review takes too long.", direction: "AI-assisted proposal intake, scoring support, reviewer dashboard, and structured evaluation.", outcome: "Shorter review cycles with a consistent, auditable process." },
      { challenge: "A cooperative manages members, board papers, and applications by hand.", direction: "Cooperative portal with member records, a board document centre, and application workflow.", outcome: "Better governance and less manual administration." },
      { challenge: "Event teams juggle registration and on-site attendance across venues.", direction: "Registration plus QR attendance with live tracking and post-event reporting.", outcome: "Smooth check-in and accurate attendance records." },
      { challenge: "Leaders lack a clear, current picture of project progress.", direction: "Programme monitoring dashboard drawing status from the teams doing the work.", outcome: "Decisions based on current information, not stale reports." },
      { challenge: "Community outreach depends on scattered contact lists.", direction: "Outreach platform for registration, segmentation, and ongoing engagement.", outcome: "Consistent contact with the communities served." },
    ],
  },

  trust: {
    heading: "Trust and governance",
    principles: [
      "Information is reviewed only to prepare an initial diagnosis.",
      "Confidential or highly sensitive information should not be submitted through this public form.",
      "Remove personal, classified, restricted, financial, or security-sensitive information unless a secure arrangement is in place.",
      "CAP may request further clarification before responding.",
      "A submission does not create a contractual relationship.",
      "Recommendations are preliminary until properly validated.",
      "CAP will not use client information publicly without permission.",
      "Formal projects are subject to agreed scope, governance, pricing, security, and documentation.",
    ],
  },

  finalCta: {
    heading: "Your organisation may not need more software. It may need a better solution.",
    body: "Share the challenge with CAP. We will help you understand what may be possible.",
    primaryCta: "Start my free digital diagnosis",
    secondaryCta: "Request a consultation",
  },

  faq: {
    heading: "Questions organisations ask us",
    items: [
      { q: "Do I need to know what system I want?", a: "No. That is the point of this service. Describe the problem and we help identify the right digital direction." },
      { q: "Is the initial diagnosis free?", a: "Yes. The initial diagnosis is free and carries no obligation." },
      { q: "What happens after I submit?", a: "Our CAP team reviews your submission and prepares an initial diagnosis, usually within 24 hours. We may contact you if we need more detail." },
      { q: "Will I receive an immediate AI answer?", a: "No. CAP does not send an uncontrolled automated answer to you. Your submission is reviewed by the team. AI may support internal analysis, but every response is checked and prepared by a person before it is sent." },
      { q: "Why is the diagnosis reviewed by a human?", a: "So the recommendation reflects real judgement about your context, governance, and constraints, not a generic machine reply." },
      { q: "How detailed should my submission be?", a: "As detailed as is comfortable. More context leads to a more useful diagnosis, but a few honest sentences is enough to begin." },
      { q: "Can I upload documents?", a: "Yes, within the file types and size shown on the form. Please do not upload confidential or classified files through the public form." },
      { q: "Can I submit a confidential issue?", a: "Please do not submit sensitive detail here. Tell us the shape of the problem and we can arrange a more secure consultation." },
      { q: "What kind of organisations can use this service?", a: "Ministries, agencies, local authorities, GLCs, statutory bodies, cooperatives, universities, NGOs, associations, corporates, SMEs, training providers, and event organisers." },
      { q: "What digital solutions can CAP develop?", a: "Portals, dashboards, registration and event systems, workflow automation, reporting tools, AI-assisted analysis, websites, and custom prototypes, among others." },
      { q: "How much does a project cost?", a: "It depends on scope, complexity, security, and support needs. The diagnosis may give an early indication; firm pricing follows a proper scoping discussion." },
      { q: "How long does development take?", a: "Timelines vary by scope. Modern workflows often shorten delivery, and a pilot can start small." },
      { q: "Can CAP start with a pilot?", a: "Yes. A focused pilot is often the best way to prove value before a larger commitment." },
      { q: "Can CAP work with our existing vendor or IT team?", a: "Yes. We are comfortable working alongside internal teams and existing suppliers." },
      { q: "Does CAP support government procurement requirements?", a: "Yes. Formal engagements follow agreed governance, documentation, and procurement requirements." },
      { q: "Will submitting a challenge commit us to a project?", a: "No. A submission is an enquiry. There is no obligation to proceed." },
    ],
  },

  privacyWarning:
    "Please do not submit classified, restricted, confidential, security-sensitive, personal, medical, financial, or legally protected information through this public form. CAP can arrange a more secure consultation process where required.",

  demo: {
    heading: "See how a diagnosis works",
    sub: "Sample challenges and the kind of direction CAP would explore. Examples only.",
    items: [
      { challenge: "We manage 2,000 programme participants using forms, WhatsApp, and Excel. Reporting takes weeks.", direction: "Centralised participant portal, attendance tracking, progress dashboard, automated reporting, and document management." },
      { challenge: "Our agency receives many proposals but reviewing them takes too long.", direction: "AI-assisted proposal intake, scoring support, reviewer dashboard, structured evaluation, and reporting." },
      { challenge: "Our cooperative manages members, board documents, meetings, and applications manually.", direction: "Cooperative management portal with member records, board document centre, application workflow, and governance dashboard." },
    ],
  },
};

export type SiteContent = typeof defaultContent;
