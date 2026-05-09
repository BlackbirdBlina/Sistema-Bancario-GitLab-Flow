"use client";

import { useState } from "react";
import { yieldInterest } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";
import { accounts } from "@/store/accountStore";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

interface YieldInterestFormProps {
  onChange?: () => void;
}

export default function YieldInterestForm({ onChange }: YieldInterestFormProps) {
  const [interestRate, setInterestRate] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseFloat(interestRate);
    if (!interestRate || isNaN(n) || n <= 0) {
      setFeedback({
        type: "error",
        text: "Informe uma taxa de juros válida.",
      });
      return;
    }
    try {
      for (const account of accounts) {
        if (account[1].type === "savings") {
          yieldInterest(account[0], n);
        }
      }
      setFeedback({
        type: "success",
        text: "Juros aplicados com sucesso.",
      });
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
        <label htmlFor="interest-rate" className="term-label">
          Taxa de juros
        </label>
        <div className="flex items-center gap-2">
          <input
            id="interest-rate"
            type="number"
            inputMode="numeric"
            min="0.01"
            step="0.01"
            placeholder="Ex: 5"
            value={interestRate}
            onChange={(e) => {
              setInterestRate(e.target.value);
              setFeedback(null);
            }}
            className="term-input min-w-[7rem]"
          />
          <span className="term-label" style={{ display: "inline-flex", marginBottom: 0 }}>
            %
          </span>
        </div>
      </div>
      <button type="submit" className="term-btn term-btn-accent mt-1">
        Aplicar Juros
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
