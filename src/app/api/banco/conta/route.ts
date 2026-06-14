import { registerAccount } from "@/services/accountService";
import { errorResponse } from "@/lib/apiError";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountNumber, type, initialBalance } = body;

    if (typeof accountNumber !== "number") {
      return Response.json(
        { error: "accountNumber deve ser número." },
        { status: 400 }
      );
    }
    if (
      type !== undefined &&
      type !== "base" &&
      type !== "savings" &&
      type !== "bonus"
    ) {
      return Response.json(
        { error: "type deve ser 'base', 'savings' ou 'bonus'." },
        { status: 400 }
      );
    }
    if (initialBalance !== undefined && typeof initialBalance !== "number") {
      return Response.json(
        { error: "initialBalance deve ser número." },
        { status: 400 }
      );
    }

    const account = registerAccount(accountNumber, type, initialBalance);
    return Response.json(account, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
