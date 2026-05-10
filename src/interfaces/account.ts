export interface Account {
  accountNumber: number;
  balance: number;
  type: "base" | "savings" | "bonus";
}

export interface BaseAccount extends Account {
  type: "base";
}

export interface SavingsAccount extends Account {
  type: "savings";
}

export interface BonusAccount extends Account {
  type: "bonus";
  score: number;
}

export type AccountType = BaseAccount | SavingsAccount | BonusAccount;
