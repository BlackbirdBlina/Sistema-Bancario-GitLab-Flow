import { Account } from "@/interfaces/account";

const INITIAL_ACCOUNTS: Account[] = [];

export const accounts = new Map<number, Account>(
  INITIAL_ACCOUNTS.map((account) => [account.accountNumber, account])
);
