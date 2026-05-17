"use client";

import { useState } from "react";
import { registerAccount } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

interface RegisterAccountFormProps {
  onChange?: () => void;
}

export default function RegisterAccountForm({ onChange }: RegisterAccountFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"base" | "savings" | "bonus">("base");
  const [initialBalance, setInitialBalance] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const n = parseInt(accountNumber, 10);
    const initialBalanceValue = parseFloat(initialBalance);
    if (!accountNumber || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta válido.",
      });
      return;
    }
    if (isNaN(initialBalanceValue) || initialBalanceValue < 0) {
      setFeedback({
        type: "error",
        text: "Informe um saldo inicial válido.",
      });
      return;
    }
    try {
      registerAccount(n, accountType, initialBalanceValue);
      setFeedback({ type: "success", text: `Conta ${n} criada com sucesso.` });
      setAccountNumber("");
      setAccountType("base");
      setInitialBalance("");
      onChange?.();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
      <div className="flex flex-col gap-1">
        <label htmlFor="register-account-number" className="term-label">
          Nº da conta
        </label>
        <input
          id="register-account-number"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="Ex: 1001"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            setInitialBalance("");
            setFeedback(null);
          }}
          className="term-input"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="register-account-type" className="term-label">
          Tipo de conta
        </label>
        <select
          id="register-account-type"
          value={accountType}
          onChange={(e) => {
            setAccountType(e.target.value as "base" | "savings" | "bonus");
            setInitialBalance("");
            setFeedback(null);
          }}
          className="term-input"
        >
          <option value="base">Conta Base</option>
          <option value="savings">Conta Poupança</option>
          <option value="bonus">Conta Bônus</option>
        </select>
      </div>
      {/* Campo condicional para saldo inicial, visível apenas para conta poupança ou base */}
      {(accountType === "savings" || accountType === "base") && (
        <div className="flex flex-col gap-1">
          <label htmlFor="initial-balance" className="term-label">
            Saldo Inicial
          </label>
          <input
            id="initial-balance"
            type="number"
            inputMode="numeric"
            min="0"
            step="0.01"
            placeholder="Ex: 100.00"
            value={initialBalance}
            onChange={(e) => {
              setInitialBalance(e.target.value);
              setFeedback(null);
            }}
            className="term-input"
          />
        </div>
      )}

      <button type="submit" className="term-btn term-btn-accent mt-1">
        Registrar
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
