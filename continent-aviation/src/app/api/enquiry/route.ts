import { handleSubmission } from "@/lib/handle-submission";
import { enquirySchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handleSubmission(req, "charter-enquiry", enquirySchema);
}
