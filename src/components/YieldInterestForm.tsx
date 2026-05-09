"use client";

import { useState, useEffect } from "react";
import { yieldInterest } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";
import { accounts } from "@/store/accountStore";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

interface YieldInterestFormProps {
  version?: number;
}

export default function YieldInterestForm({ version }: YieldInterestFormProps) {
  const [interestRate, setInterestRate] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (interestRate) {
      const n = parseInt(interestRate, 10);
      if (!isNaN(n) && n > 0) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          //   setBalance(checkBalance(n));
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
    const n = parseInt(interestRate, 10);
    if (!interestRate || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe uma taxa de juros válida.",
      });
      return;
    }
    try {
      for (const account of accounts) {
        if (account[1].type === "poupanca") {
          yieldInterest(account[0], n);
        }
      }
      setFeedback(null);
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
        <label htmlFor="interest-rate" className="term-label">
          Taxa de juros
        </label>
        <input
          id="interest-rate"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="Ex: 1001"
          value={interestRate}
          onChange={(e) => {
            setInterestRate(e.target.value);
            setFeedback(null);
          }}
          className="term-input"
        />
      </div>
      <button type="submit" className="term-btn term-btn-accent mt-1">
        Aplicar Juros
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
