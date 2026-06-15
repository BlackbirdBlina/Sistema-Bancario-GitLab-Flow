import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccount,
  checkBalance,
  credit,
  debit,
  registerAccount,
  transfer,
  yieldInterest,
} from "../accountService";
import { accounts } from "@/store/accountStore";
import { BonusAccount } from "@/interfaces/account";

describe("AccountService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    accounts.clear();
  });

  it("should register a new account with default values", () => {
    const account = registerAccount(122);
    expect(account).toEqual({
      accountNumber: 122,
      balance: 0,
      type: "base",
    });
  });

  it("should register a new account base", () => {
    const account = registerAccount(123, "base", 100);
    expect(account).toEqual({
      accountNumber: 123,
      balance: 100,
      type: "base",
    });
  });

  it("should register a new account savings", () => {
    const account = registerAccount(124, "savings", 200);
    expect(account).toEqual({
      accountNumber: 124,
      balance: 200,
      type: "savings",
    });
  });

  it("should register a new account bonus", () => {
    const account = registerAccount(125, "bonus", 50);
    expect(account).toEqual({
      accountNumber: 125,
      balance: 50,
      type: "bonus",
      score: 10,
    });
  });

  it("should throw an error when trying to register an account with an existing account number", () => {
    registerAccount(122);
    const existingAccountNumber = 122;
    expect(() => registerAccount(existingAccountNumber)).toThrow(
      "Número de conta 122 já existe. Escolha outro número para a conta."
    );
  });

  it("should return the information for an already registered account", () => {
    registerAccount(122);
    expect(getAccount(122)).toEqual({
      accountNumber: 122,
      balance: 0,
      type: "base",
    });
  });

  it("should return the information for an already registered account (savings)", () => {
    registerAccount(122, "savings", 100);
    expect(getAccount(122)).toEqual({
      accountNumber: 122,
      balance: 100,
      type: "savings",
    });
  });

  it("should return the information for an already registered account (bonus)", () => {
    registerAccount(122, "bonus", 50);
    expect(getAccount(122)).toEqual({
      accountNumber: 122,
      balance: 50,
      type: "bonus",
      score: 10,
    });
  });

  it("This should throw a non-existent account error when trying to check an unregistered account", () => {
    expect(() => getAccount(999)).toThrow("Conta 999 não encontrada");
  });

  it("should return the correct balance for the base account", () => {
    registerAccount(122);
    expect(checkBalance(122)).toBe(0);
  });

  it("should return the correct balance for the savings account", () => {
    registerAccount(123, "savings", 100);
    expect(checkBalance(123)).toBe(100);
  });

  it("should return the correct balance for the bonus account", () => {
    registerAccount(124, "bonus", 50);
    expect(checkBalance(124)).toBe(50);
  });

  it("should throw an error when trying to check the balance of a non-existent account", () => {
    expect(() => checkBalance(999)).toThrow("Conta 999 não encontrada");
  });

  it("must deposit into an existing default account", () => {
    registerAccount(122);
    credit(122, 100);
    expect(checkBalance(122)).toBe(100);
  });

  it("must deposit into an existing savings account", () => {
    registerAccount(123, "savings", 50);
    credit(123, 100);
    expect(checkBalance(123)).toBe(150);
  });

  it("must deposit into an existing bonus account", () => {
    registerAccount(124, "bonus", 50);
    credit(124, 100);
    expect(checkBalance(124)).toBe(150);
  });

  it("must throw an error when trying to deposit a non-positive amount", () => {
    registerAccount(122);
    expect(() => credit(122, -50)).toThrow("O valor deve ser maior que zero.");
  });

  it("should inform the correct amount to the base account after a deposit", () => {
    registerAccount(125, "base", 50);
    credit(125, 300);
    const account = accounts.get(125);
    expect(account?.balance).toBe(350);
  });

  it("should inform the correct amount to the savings account after a deposit", () => {
    registerAccount(125, "savings", 50);
    credit(125, 300);
    const account = accounts.get(125);
    expect(account?.balance).toBe(350);
  });

  it("should inform the correct bonus score after a deposit", () => {
    registerAccount(125, "bonus", 50);
    credit(125, 300);
    const account = accounts.get(125);
    expect(account?.balance).toBe(350);
    expect((account as BonusAccount).score).toBe(12);
  });

  it("should throw an error when trying to deposit into a non-existent account", () => {
    expect(() => credit(999, 100)).toThrow("Conta 999 não encontrada");
  });

  it("should transfer to an existing account", () => {
    registerAccount(122, "base", 150);
    registerAccount(123, "base", 50);
    transfer(122, 123, 50);
    expect(checkBalance(122)).toBe(100);
    expect(checkBalance(123)).toBe(100);
  });

  it("should inform the correct bonus score", () => {
    registerAccount(125, "bonus", 50);
    registerAccount(122, "bonus", 250);
    transfer(122, 125, 50);
    expect(checkBalance(122)).toBe(200);
    expect(checkBalance(125)).toBe(100);
    const account = accounts.get(125);
    expect((account as BonusAccount).score).toBe(10);
  });

  it("should throw an error when trying TRANSFER FROM a non-existent account", () => {
    registerAccount(123, "base", 50);
    expect(() => transfer(999, 123, 50)).toThrow("Conta 999 não encontrada");
  });

  it("should throw an error when trying TRANSFER TO a non-existent account", () => {
    registerAccount(123, "base", 50);
    expect(() => transfer(123, 999, 50)).toThrow("Conta 999 não encontrada");
  });

  it("should throw an error when trying to TRANSFER to the same account", () => {
    registerAccount(122);
    expect(() => transfer(122, 122, 50)).toThrow(
      "A conta de origem e a conta de destino não podem ser iguais."
    );
  });

  it("should throw an error when trying to TRANSFER a non-positive amount", () => {
    registerAccount(122);
    registerAccount(123);
    expect(() => transfer(122, 123, -50)).toThrow("O valor deve ser maior que zero.");
  });

  it("should throw an error when trying to TRANSFER an amount that exceeds the balance (base accounts)", () => {
    registerAccount(122, "base", 100);
    registerAccount(123, "base", 50);
    expect(() => transfer(122, 123, 1500)).toThrow("Saldo insuficiente para débito."); // Limite de saldo negativo -1000
  });

  it("should throw an error when trying to TRANSFER an amount that exceeds the balance (savings accounts)", () => {
    registerAccount(122, "savings", 100);
    registerAccount(123, "savings", 50);
    expect(() => transfer(122, 123, 150)).toThrow("Saldo insuficiente para débito."); // Não pode ter saldo negativo
  });

  it("should throw an error when trying to TRANSFER an amount that exceeds the balance (bonus accounts)", () => {
    registerAccount(140, "bonus", 100);
    registerAccount(123, "bonus", 50);
    expect(() => transfer(140, 123, 1500)).toThrow("Saldo insuficiente para débito."); // Limite de saldo negativo -1000
  });

  it("should inform the correct balance after a DEBIT operation", () => {
    registerAccount(122, "base", 150);
    debit(122, 50);
    expect(checkBalance(122)).toBe(100);
  });

  it("should throw an error when trying to DEBIT a non-existent account", () => {
    expect(() => debit(999, 50)).toThrow("Conta 999 não encontrada");
  });

  it("should throw an error when trying to DEBIT a non-positive amount", () => {
    registerAccount(122);
    expect(() => debit(122, -50)).toThrow("O valor deve ser maior que zero.");
  });

  it("should throw an error when trying to DEBIT an amount that exceeds the balance (base account)", () => {
    registerAccount(1, "base", 100);
    expect(() => debit(1, 1500)).toThrow("Saldo insuficiente para débito."); // Limite de saldo negativo -1000
  });

  it("should throw an error when trying to DEBIT an amount that exceeds the balance (savings account)", () => {
    registerAccount(150, "savings", 100);
    expect(() => debit(150, 170)).toThrow("Saldo insuficiente para débito."); // Não pode ter saldo negativo
  });

  it("should throw an error when trying to DEBIT an amount that exceeds the balance (bonus account)", () => {
    registerAccount(30, "bonus", 100);
    expect(() => debit(30, 1500)).toThrow("Saldo insuficiente para débito."); // Limite de saldo negativo -1000
  });

  it("should inform the correct yield for all savings accounts", () => {
    registerAccount(122, "savings", 1000);
    registerAccount(123, "savings", 2000);
    registerAccount(124, "savings", 3000);
    yieldInterest(122, 10);
    yieldInterest(123, 10);
    yieldInterest(124, 10);
    expect(checkBalance(122)).toBe(1100);
    expect(checkBalance(123)).toBe(2200);
    expect(checkBalance(124)).toBe(3300);
  });

  it("should throw an error when trying apply yield to a non-existent account", () => {
    expect(() => yieldInterest(120, 5)).toThrow("Conta 120 não encontrada");
  });

  it("should throw an error when trying apply yield to a base account", () => {
    registerAccount(14, "base", 1200);
    expect(() => yieldInterest(14, 5)).toThrow("Apenas contas poupança podem render juros.");
  });

  it("should throw an error when trying apply yield to a bonus account", () => {
    registerAccount(16, "bonus", 1200);
    expect(() => yieldInterest(16, 5)).toThrow("Apenas contas poupança podem render juros.");
  });
});
