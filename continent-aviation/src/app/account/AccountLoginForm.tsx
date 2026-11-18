"use client";

import { useState } from "react";

export function AccountLoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [devLink, setDevLink] = useState("");
  const [trap, setTrap] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending"); setMsg("");
    try {
      const r = await fetch("/api/account/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website: trap }) });
      const b = await r.json().catch(() => ({}));
      if (r.ok) { setState("sent"); setDevLink(b.devLink ?? ""); } else { setState("error"); setMsg(b.message ?? "We could not send the link. Please try again."); }
    } catch { setState("error"); setMsg("We could not reach the server. Please try again."); }
  }

  if (state === "sent") {
    return (
      <div className="mt-8 border border-gold/50 p-6" role="status">
        <h2 className="font-serif text-2xl">Check your inbox.</h2>
        <p className="mt-3 text-ivory/80">We sent a sign-in link to <strong className="font-medium text-ivory">{email}</strong>. It works once and expires in 15 minutes. Please also check your spam folder.</p>
        {devLink && <p className="mt-4 border border-gold/60 p-3 text-xs text-gold">Development mode: email is not configured. <a className="underline" href={devLink}>Open sign-in link</a></p>}
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
      <div className="field">
        <label htmlFor="acct-email">Email address</label>
        <input id="acct-email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
      {state === "error" && <p className="field-error" role="alert">{msg}</p>}
      <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={state === "sending" || !email.trim()}>{state === "sending" ? "Sending" : "Email me a sign-in link"}</button>
      <p className="text-[0.82rem] text-grey">No password needed. We email you a one-time link. New here? Entering your email creates your account the first time.</p>
    </form>
  );
}
