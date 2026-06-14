import { getAccount } from "@/services/accountService";
import { errorResponse } from "@/lib/apiError";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountNumber = Number(id);
    if (Number.isNaN(accountNumber)) {
      return Response.json({ error: "id inválido." }, { status: 400 });
    }

    const account = getAccount(accountNumber);
    return Response.json(account, { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}
