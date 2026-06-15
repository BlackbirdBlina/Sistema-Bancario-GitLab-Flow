import { yieldInterest, getAccount } from "@/services/accountService";
import { errorResponse } from "@/lib/apiError";

export async function PUT(request: Request) {
  try {
    const { accountNumber, interestRate } = await request.json();

    if (typeof accountNumber !== "number" || typeof interestRate !== "number") {
      return Response.json(
        { error: "accountNumber e interestRate devem ser números." },
        { status: 400 }
      );
    }

    yieldInterest(accountNumber, interestRate);
    return Response.json(getAccount(accountNumber), { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}
