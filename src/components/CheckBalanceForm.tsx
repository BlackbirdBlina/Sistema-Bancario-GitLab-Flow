"use client";

import { useState, useEffect } from "react";
import { checkBalance } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

interface CheckBalanceFormProps {
  version?: number;
}

export default function CheckBalanceForm({ version }: CheckBalanceFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (balance !== null && accountNumber) {
      const n = parseInt(accountNumber, 10);
      if (!isNaN(n) && n > 0) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setBalance(checkBalance(n));
          setFeedback(null);
        } catch {
          // conta pode ter sido deletada; ignora silenciosamente
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(accountNumber, 10);
    if (!accountNumber || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta válido.",
      });
      setBalance(null);
      return;
    }
    try {
      const result = checkBalance(n);
      setBalance(result);
      setFeedback(null);
    } catch (err) {
      setBalance(null);
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
      <div className="flex flex-col gap-1">
        <label htmlFor="balance-account-number" className="term-label">
          Nº da conta
        </label>
        <input
          id="balance-account-number"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="Ex: 1001"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            setBalance(null);
            setFeedback(null);
          }}
          className="term-input"
        />
      </div>
      <button
        type="submit"
        className="term-btn mt-1"
        style={{ background: "#818cf8", color: "#0b0d10" }}
      >
        Consultar
      </button>
      {balance !== null && (
        <div
          className="tnum"
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "1.375rem",
            fontWeight: 700,
            color:
              balance < 0
                ? "var(--danger)"
                : balance === 0
                ? "var(--muted)"
                : "var(--accent)",
            letterSpacing: "0.02em",
            paddingTop: "0.25rem",
          }}
        >
          {formatBRL(balance)}
        </div>
      )}
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
