"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "../actions";
import { Icon } from "@/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
      {!pending && <Icon.Arrow className="h-4 w-4" />}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
      </div>
      {state?.error && (
        <p className="rounded-md border border-danger/40 bg-danger-soft/60 px-3 py-2 text-sm text-ink" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
