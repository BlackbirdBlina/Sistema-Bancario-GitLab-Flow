import { accounts } from "@/store/accountStore";
import { Account } from "@/interfaces/account";

export function registerAccount() {
  // TODO: Implement account registration
}

export function credito(accountNumber: number, amount: number) {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  if (amount <= 0) {
    throw new Error("O valor deve ser maior que zero.");
  }
  account.balance += amount;
  accounts.set(accountNumber, account);
}