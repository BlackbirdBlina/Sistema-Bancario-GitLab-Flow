import { transfer, getAccount } from "@/services/accountService";
import { errorResponse } from "@/lib/apiError";

export async function PUT(request: Request) {
  try {
    const { from, to, amount } = await request.json();

    if (
      typeof from !== "number" ||
      typeof to !== "number" ||
      typeof amount !== "number"
    ) {
      return Response.json(
        { error: "from, to e amount devem ser números." },
        { status: 400 }
      );
    }

    transfer(from, to, amount);
    return Response.json(
      { from: getAccount(from), to: getAccount(to) },
      { status: 200 }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
