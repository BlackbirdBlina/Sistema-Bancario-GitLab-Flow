"use client";

import { useState } from "react";
import { debit } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

interface DebitFormProps {
  onChange?: () => void;
}

export default function DebitForm({ onChange }: DebitFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const n = parseInt(accountNumber, 10);
    const v = parseFloat(amount);
    if (!accountNumber || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta válido.",
      });
      return;
    }
    if (!amount || isNaN(v) || v <= 0) {
      setFeedback({ type: "error", text: "Informe um valor maior que zero." });
      return;
    }
    try {
      debit(n, v);
      setFeedback({
        type: "success",
        text: `−${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(v)} ← conta ${n}`,
      });
      setAmount("");
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
      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="flex flex-col gap-1">
          <label htmlFor="debit-account-number" className="term-label">
            Nº conta
          </label>
          <input
            id="debit-account-number"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="1001"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setFeedback(null);
            }}
            className="term-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="debit-amount" className="term-label">
            Valor R$
          </label>
          <input
            id="debit-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="50.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setFeedback(null);
            }}
            className="term-input"
          />
        </div>
      </div>
      <button type="submit" className="term-btn term-btn-danger mt-1">
        Debitar
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
