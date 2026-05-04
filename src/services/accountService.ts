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

export function checkBalance(accountNumber: number): number {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  return account.balance;
}

export function credit(accountNumber: number, amount: number) {
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

export function debit(accountNumber: number, amount: number) {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  if (amount <= 0) {
    throw new Error("O valor deve ser maior que zero.");
  }
  account.balance -= amount;
  accounts.set(accountNumber, account);
}

export function transfer(
  sourceAccountNumber: number,
  destinationAccountNumber: number,
  amount: number
) {
  if (sourceAccountNumber === destinationAccountNumber) {
    throw new Error(
      "A conta de origem e a conta de destino não podem ser iguais."
    );
  }
  debit(sourceAccountNumber, amount);
  credit(destinationAccountNumber, amount);
}
