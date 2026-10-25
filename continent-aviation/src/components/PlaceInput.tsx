"use client";

import { useId, useRef, useState } from "react";
import { labelFor, searchPlaces, type Place } from "@/config/airports";

type Props = {
  name: string;
  id: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  onValueChange?: (v: string) => void;
};

/** Text input with place suggestions (ARIA combobox). Any text is allowed: hotels, venues and helipads are fine. */
export function PlaceInput({ name, id, defaultValue = "", required, className = "input", placeholder, onValueChange, ...aria }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const ref = useRef<HTMLInputElement>(null);
  const items: Place[] = open ? searchPlaces(value) : [];

  const choose = (p: Place) => {
    const v = labelFor(p);
    setValue(v); onValueChange?.(v); setOpen(false); setActive(-1);
    // keep native form + validation listeners informed
    if (ref.current) { ref.current.value = v; ref.current.dispatchEvent(new Event("input", { bubbles: true })); }
  };

  return (
    <div className="relative">
      <input
        ref={ref} id={id} name={name} type="text" required={required} autoComplete="off" spellCheck={false} className={className} placeholder={placeholder}
        role="combobox" aria-autocomplete="list" aria-expanded={open && items.length > 0} aria-controls={listId} aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        value={value}
        onChange={(e) => { setValue(e.target.value); onValueChange?.(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(items.length - 1, a + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
          else if (e.key === "Enter" && open && active >= 0 && items[active]) { e.preventDefault(); choose(items[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
        {...aria}
      />
      {open && items.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto border border-gold/50 bg-navy text-ivory shadow-xl">
          {items.map((p, i) => (
            <li key={labelFor(p)} id={`${listId}-${i}`} role="option" aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(p); }} onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-2.5 text-[0.92rem] ${i === active ? "bg-gold/20" : ""}`}>
              <span className="font-medium">{p.city}{p.code ? ` (${p.code})` : ""}</span>
              <span className="block text-xs text-ivory/60">{p.name}{p.country !== "India" ? `, ${p.country}` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
