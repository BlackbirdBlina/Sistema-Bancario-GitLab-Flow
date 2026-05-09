export interface Account {
  accountNumber: number;
  balance: number;
  type: 'base' | 'poupanca';
}

export interface BaseAccount extends Account {
  type: 'base';
}

export interface SavingsAccount extends Account {
  type: 'poupanca';
}

export type AccountType = BaseAccount | SavingsAccount;