"use client";

import { useState } from "react";
import { transfer } from "@/services/accountService";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

interface TransferFormProps {
  onChange?: () => void;
}

export default function TransferForm({ onChange }: TransferFormProps) {
  const [sourceAccount, setSourceAccount] = useState("");
  const [destinationAccount, setDestinationAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function clearFeedback() {
    setFeedback(null);
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const src = parseInt(sourceAccount, 10);
    const dst = parseInt(destinationAccount, 10);
    const v = parseFloat(amount);
    if (!sourceAccount || isNaN(src) || src <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta de origem válido.",
      });
      return;
    }
    if (!destinationAccount || isNaN(dst) || dst <= 0) {
      setFeedback({
        type: "error",
        text: "Informe um número de conta de destino válido.",
      });
      return;
    }
    if (!amount || isNaN(v) || v <= 0) {
      setFeedback({ type: "error", text: "Informe um valor maior que zero." });
      return;
    }
    try {
      transfer(src, dst, v);
      setFeedback({
        type: "success",
        text: `${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(v)} · ${src} → ${dst}`,
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
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="transfer-source" className="term-label">
            Origem
          </label>
          <input
            id="transfer-source"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="1001"
            value={sourceAccount}
            onChange={(e) => {
              setSourceAccount(e.target.value);
              clearFeedback();
            }}
            className="term-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="transfer-destination" className="term-label">
            Destino
          </label>
          <input
            id="transfer-destination"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="2002"
            value={destinationAccount}
            onChange={(e) => {
              setDestinationAccount(e.target.value);
              clearFeedback();
            }}
            className="term-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="transfer-amount" className="term-label">
            Valor R$
          </label>
          <input
            id="transfer-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="200.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearFeedback();
            }}
            className="term-input"
          />
        </div>
      </div>
      <button type="submit" className="term-btn term-btn-warn mt-1">
        Transferir
      </button>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
