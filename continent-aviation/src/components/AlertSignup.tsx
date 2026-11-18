"use client";

import { useRef, useState } from "react";
import { PlaceInput } from "./PlaceInput";

/** Route-alert sign-up. Promises nothing about availability: it only emails when an operator offers something suitable. */
export function AlertSignup() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const t0 = useRef(Date.now());

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState("error"); setMsg("Please enter a valid email address."); return; }
    if (fd.get("consent") !== "on") { setState("error"); setMsg("Please tick the box so we can email you."); return; }
    setState("sending"); setMsg("");
    try {
      const r = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, route: String(fd.get("route") ?? "").trim(), consent: true, website: String(fd.get("website") ?? ""), elapsedMs: Date.now() - t0.current }) });
      const b = await r.json().catch(() => ({}));
      if (r.ok && b.ok) setState("done"); else { setState("error"); setMsg(b.message ?? "We could not save your sign-up. Please try again."); }
    } catch { setState("error"); setMsg("We could not reach the server. Please try again."); }
  }

  if (state === "done") return <div role="status" className="border border-gold/50 p-7"><h2 className="font-serif text-3xl">You are on the list.</h2><p className="mt-3 text-ivory/80">We will email you if suitable options for that route are offered by an operator. You can unsubscribe at any time from any email.</p></div>;
  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-labelledby="alert-h">
      <p className="eyebrow">Route alerts</p>
      <h2 id="alert-h" className="font-serif text-3xl">Hear when options appear.</h2>
      <p className="text-ivory/75">Operators occasionally have aircraft that need to fly a route anyway. Tell us the route you care about and we will email you if something suitable is offered. We do not list options unless an operator offers them.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field"><label htmlFor="alert-route">Route <span className="opt">(optional)</span></label><PlaceInput id="alert-route" name="route" placeholder="For example Mumbai to Goa" className="input" /></div>
        <div className="field"><label htmlFor="alert-email">Email</label><input id="alert-email" name="email" type="email" autoComplete="email" required className="input" /></div>
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex cursor-pointer items-start gap-3 text-[0.92rem]"><input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-[#c8a96b]" /><span>I agree that Continent Aviation may email me about this route. I can unsubscribe at any time.</span></label>
      {state === "error" && <p role="alert" className="field-error">{msg}</p>}
      <button type="submit" disabled={state === "sending"} className="btn btn-gold">{state === "sending" ? "Saving" : "Sign up for alerts"}</button>
    </form>
  );
}
