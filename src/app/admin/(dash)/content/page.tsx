import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content.server";
import { saveContentAction } from "@/app/admin/actions";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Content" };

export default async function ContentPage() {
  const c = await getSiteContent();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-ink">Content</h1>
        <p className="mt-1 text-ink-soft">
          Edit key public copy. Changes publish to the live homepage immediately. This is a starter
          set; the full content model (services, examples, FAQ, legal) is stored in editable
          modules ready to expose here.
        </p>
      </div>

      <form action={saveContentAction} className="space-y-5 rounded-xl border border-border bg-white p-6">
        <div>
          <label className="field-label" htmlFor="headline">Hero headline</label>
          <input id="headline" name="headline" defaultValue={c.hero.headline} className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="subhead">Hero subhead</label>
          <textarea id="subhead" name="subhead" rows={3} defaultValue={c.hero.subhead} className="field-input resize-y" />
        </div>
        <div>
          <label className="field-label" htmlFor="primaryCta">Primary button label</label>
          <input id="primaryCta" name="primaryCta" defaultValue={c.hero.primaryCta} className="field-input" />
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
          <Icon.Check className="h-4 w-4" /> Publish changes
        </button>
      </form>

      <div className="rounded-xl border border-border bg-white p-6 text-sm text-ink-soft">
        <p className="font-semibold text-ink">Editable content modules</p>
        <p className="mt-1.5">
          Services, example solutions, expectation pillars, the AI ecosystem, FAQ, and the legal
          notices are all defined as structured content and merged with admin overrides at render
          time. Each can be surfaced here as the CMS grows, and later split into translation files
          for Bahasa Melayu, Mandarin, and Iban.
        </p>
      </div>
    </div>
  );
}
