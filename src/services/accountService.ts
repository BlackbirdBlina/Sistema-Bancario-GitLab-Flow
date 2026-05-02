import { accounts } from "@/store/accountStore";
import { Account } from "@/interfaces/account";

export function registerAccount() {
  // TODO: Implement account registration
}

export function consultarSaldo(accountNumber: number) : number {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  return account.balance;
}