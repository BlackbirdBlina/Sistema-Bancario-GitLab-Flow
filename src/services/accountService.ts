import { accounts } from "@/store/accountStore";
import { Account } from "@/interfaces/account";

export function registerAccount(accountNumber: number): Account {
  if (accounts.has(accountNumber)) {
    throw new Error(
      `Número de conta ${accountNumber} já existe. Escolha outro número para a conta.`
    );
  }
  const newAccount: Account = {
    accountNumber,
    balance: 0,
  };
  accounts.set(accountNumber, newAccount);
  return newAccount;
}
