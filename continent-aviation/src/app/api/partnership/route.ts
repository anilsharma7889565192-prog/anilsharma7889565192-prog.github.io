import { handleSubmission } from "@/lib/handle-submission";
import { partnershipSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handleSubmission(req, "partnership-enquiry", partnershipSchema);
}
