import { credit, getAccount } from "@/services/accountService";
import { errorResponse } from "@/lib/apiError";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountNumber = Number(id);
    if (Number.isNaN(accountNumber)) {
      return Response.json({ error: "id inválido." }, { status: 400 });
    }

    const { amount } = await request.json();
    if (typeof amount !== "number") {
      return Response.json(
        { error: "amount deve ser número." },
        { status: 400 }
      );
    }

    credit(accountNumber, amount);
    return Response.json(getAccount(accountNumber), { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}
