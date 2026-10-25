import { STATUS_LABEL, type Status } from "@/lib/status";

const tone: Record<Status, string> = {
  received: "border-gold text-gold", checking: "border-ivory/50 text-ivory", quoted: "border-[#7fb2ff] text-[#7fb2ff]", accepted: "border-[#9be09b] text-[#9be09b]",
  paid: "border-[#9be09b] text-[#9be09b]", confirmed: "border-[#9be09b] bg-[#9be09b]/10 text-[#9be09b]", declined: "border-grey text-grey", expired: "border-grey text-grey", cancelled: "border-grey text-grey",
};
export const Badge = ({ s }: { s: Status }) => <span className={`inline-block whitespace-nowrap border px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.12em] ${tone[s]}`}>{STATUS_LABEL[s]}</span>;
