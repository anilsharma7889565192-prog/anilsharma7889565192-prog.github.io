import { Mail, MessageCircle, Phone } from "lucide-react";

/** One-click ways to reach a client. WhatsApp assumes an Indian number when no country code is given. */
export function ContactLinks({ email, phone }: { email: string; phone: string | null }) {
  const digits = (phone ?? "").replace(/\D/g, "");
  const wa = digits ? (digits.length === 10 ? `91${digits}` : digits) : "";
  const cls = "inline-flex items-center gap-1.5 border border-gold/35 px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold/10";
  return (
    <div className="flex flex-wrap gap-2">
      <a className={cls} href={`mailto:${email}`}><Mail size={13} aria-hidden="true" />Email</a>
      {digits && <a className={cls} href={`tel:+${wa}`}><Phone size={13} aria-hidden="true" />Call</a>}
      {wa && <a className={cls} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} aria-hidden="true" />WhatsApp</a>}
      {phone && <span className="self-center text-[0.8rem] text-grey">{phone}</span>}
    </div>
  );
}
