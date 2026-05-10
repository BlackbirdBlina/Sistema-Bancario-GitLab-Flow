import { accounts } from "@/store/accountStore";
import { AccountType, BonusAccount } from "@/interfaces/account";

export function registerAccount(
  accountNumber: number,
  type: "base" | "savings" | "bonus" = "base"
): AccountType {
  if (accounts.has(accountNumber)) {
    throw new Error(
      `Número de conta ${accountNumber} já existe. Escolha outro número para a conta.`
    );
  }
  const newAccount: AccountType =
    type === "bonus"
      ? { accountNumber, balance: 0, type: "bonus", score: 10 }
      : { accountNumber, balance: 0, type };
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

export function credit(
  accountNumber: number,
  amount: number,
  source: "deposit" | "transfer" = "deposit"
) {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  if (amount <= 0) {
    throw new Error("O valor deve ser maior que zero.");
  }
  account.balance += amount;
  if (account.type === "bonus") {
    const divisor = source === "deposit" ? 100 : 200;
    (account as BonusAccount).score += Math.floor(amount / divisor);
  }
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
  if (account.balance < amount) {
    throw new Error("Saldo insuficiente para débito.");
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
    throw new Error("A conta de origem e a conta de destino não podem ser iguais.");
  }
  debit(sourceAccountNumber, amount);
  credit(destinationAccountNumber, amount, "transfer");
}

export function yieldInterest(accountNumber: number, interestRate: number) {
  const account = accounts.get(accountNumber);
  if (!account) {
    throw new Error(`Conta ${accountNumber} não encontrada`);
  }
  if (account.type !== "savings") {
    throw new Error("Apenas contas poupança podem render juros.");
  }
  if (interestRate <= 0) {
    throw new Error("A taxa de juros deve ser maior que zero.");
  }
  const interest = account.balance * (interestRate / 100);
  account.balance += interest;
  accounts.set(accountNumber, account);
}
