"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [devLink, setDevLink] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending"); setMsg("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const b = await r.json().catch(() => ({}));
      if (r.ok) { setState("sent"); setDevLink(b.devLink ?? ""); } else { setState("error"); setMsg(b.message ?? "Could not send the link."); }
    } catch { setState("error"); setMsg("Could not reach the server."); }
  }

  if (state === "sent") {
    return (
      <div className="mt-6" role="status">
        <p>If that address is the admin address, a sign-in link is on its way. It works once and expires in 15 minutes.</p>
        {devLink && <p className="mt-4 border border-gold/60 p-3 text-xs text-gold">Development mode: email is not configured. <a className="underline" href={devLink}>Open sign-in link</a></p>}
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
      <div className="field">
        <label htmlFor="admin-email">Admin email</label>
        <input id="admin-email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {state === "error" && <p className="field-error" role="alert">{msg}</p>}
      <button type="submit" className="btn btn-gold w-full" disabled={state === "sending"}>{state === "sending" ? "Sending" : "Email me a sign-in link"}</button>
    </form>
  );
}
