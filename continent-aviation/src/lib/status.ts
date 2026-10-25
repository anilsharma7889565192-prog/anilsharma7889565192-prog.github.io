/** Enquiry lifecycle, shared by server and client code. */
export const STATUSES = ["received", "checking", "quoted", "accepted", "paid", "confirmed", "declined", "expired", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  received: "Enquiry received",
  checking: "Checking with operator",
  quoted: "Quote sent",
  accepted: "Quote accepted",
  paid: "Payment confirmed by operator",
  confirmed: "Booking confirmed",
  declined: "Not available",
  expired: "Quote expired",
  cancelled: "Cancelled",
};

/** Plain-language meaning, shown to clients. */
export const STATUS_MEANING: Record<Status, string> = {
  received: "We have your enquiry. No operator has been contacted yet and nothing is reserved.",
  checking: "We are asking the operator about your requirement. No availability is implied.",
  quoted: "The operator's quote is ready for you to review. It stays valid until the time shown.",
  accepted: "You accepted the quote. Please follow the operator's payment instructions.",
  paid: "The operator has confirmed receiving payment. We are completing your booking confirmation.",
  confirmed: "The operator has confirmed your charter.",
  declined: "We could not secure a suitable option for this request.",
  expired: "The quote was not accepted in time. You are welcome to send a new enquiry.",
  cancelled: "This enquiry was cancelled.",
};

export const OPEN: Status[] = ["received", "checking", "quoted", "accepted", "paid"];
export const isOpen = (s: Status) => OPEN.includes(s);

/** Client-facing progress steps (a simplified timeline). */
export const TIMELINE: Status[] = ["received", "checking", "quoted", "accepted", "paid", "confirmed"];
