"use client";

import type { ReactNode } from "react";

export type Errors = Record<string, string>;

export function Field({ name, label, optional, error, hint, children, className = "" }: {
  name: string; label: string; optional?: boolean; error?: string; hint?: string; children: (p: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode; className?: string;
}) {
  const id = `f-${name}`;
  const describedBy = [error ? `${id}-err` : "", hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}{optional && <span className="opt">(optional)</span>}</label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && <p id={`${id}-hint`} className="mt-2 text-[0.82rem] text-grey">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export function Choice({ name, options, defaultValue, legend, error, onChange }: {
  name: string; options: readonly string[]; defaultValue?: string; legend: string; error?: string; onChange?: (v: string) => void;
}) {
  const id = `f-${name}`;
  return (
    <fieldset className="field" aria-describedby={error ? `${id}-err` : undefined}>
      <legend>{legend}</legend>
      <div className={`grid gap-3 ${options.length > 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
        {options.map((o, i) => (
          <label key={o} className="choice !mb-0 !block !normal-case !tracking-normal !text-ivory">
            <input type="radio" name={name} value={o} defaultChecked={defaultValue === o} onChange={() => onChange?.(o)} required={i === 0} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </fieldset>
  );
}

export function ErrorSummary({ errors, labels, refEl }: { errors: Errors; labels: Record<string, string>; refEl: React.RefObject<HTMLDivElement | null> }) {
  const keys = Object.keys(errors);
  if (!keys.length) return null;
  return (
    <div ref={refEl} tabIndex={-1} role="alert" className="mb-10 border border-[#e58b82]/60 bg-[#e58b82]/8 p-6">
      <p className="font-serif text-2xl">Please check the following</p>
      <ul className="mt-3 space-y-1 text-[0.95rem]">
        {keys.map((k) => (
          <li key={k}><a className="underline underline-offset-4 hover:text-gold" href={`#f-${k}`}>{labels[k] ?? "Form"}: {errors[k]}</a></li>
        ))}
      </ul>
    </div>
  );
}

export function SectionTitle({ n, title, children }: { n: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 border-t border-gold/35 pt-6">
      <p className="eyebrow">{n}</p>
      <h2 className="mt-2 font-serif text-3xl">{title}</h2>
      {children && <p className="mt-2 max-w-xl text-[0.95rem] text-grey">{children}</p>}
    </div>
  );
}

export function Spinner() {
  return <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-midnight/30 border-t-midnight" />;
}
