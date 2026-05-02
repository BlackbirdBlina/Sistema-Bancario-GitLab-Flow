"use client";

import { useState } from "react";
import { registerAccount } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

interface RegisterAccountFormProps {
  onChange?: () => void;
}

export default function RegisterAccountForm({ onChange }: RegisterAccountFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const n = parseInt(accountNumber, 10);
    if (!accountNumber || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta válido.",
      });
      return;
    }
    try {
      registerAccount(n);
      setFeedback({ type: "success", text: `Conta ${n} criada com sucesso.` });
      setAccountNumber("");
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
            setFeedback(null);
          }}
          className="term-input"
        />
      </div>
      <button type="submit" className="term-btn term-btn-accent mt-1">
        Registrar
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
