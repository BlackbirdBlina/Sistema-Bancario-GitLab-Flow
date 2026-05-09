export interface Account {
  accountNumber: number;
  balance: number;
  type: "base" | "savings";
}

export interface BaseAccount extends Account {
  type: "base";
}

export interface SavingsAccount extends Account {
  type: "savings";
}

export type AccountType = BaseAccount | SavingsAccount;
