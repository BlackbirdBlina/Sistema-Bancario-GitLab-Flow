import { Account } from "@/interfaces/account";

const INITIAL_ACCOUNTS: Account[] = [];

// FIXME: Add account id
export const accounts = new Map<number, Account>(
  INITIAL_ACCOUNTS.map((account) => [0, account])
);
