"use client";

import { useState, useEffect } from "react";
import { getAccount } from "@/services/accountService";
import { Account, BonusAccount } from "@/interfaces/account";
import FeedbackMessage, { Feedback } from "./FeedbackMessage";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const accountTypeLabels: Record<Account["type"], string> = {
  base: "Conta Base",
  savings: "Conta Poupança",
  bonus: "Conta Bônus",
};

interface ConsultAccountFormProps {
  version?: number;
}

export default function ConsultAccountForm({ version }: ConsultAccountFormProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [account, setAccount] = useState<Account | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (account !== null && accountNumber) {
      const n = parseInt(accountNumber, 10);
      if (!isNaN(n) && n > 0) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAccount(getAccount(n));
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
      setAccount(null);
      return;
    }
    try {
      setAccount(getAccount(n));
      setFeedback(null);
    } catch (err) {
      setAccount(null);
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro desconhecido.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
      <div className="flex flex-col gap-1">
        <label htmlFor="consult-account-number" className="term-label">
          Nº da conta
        </label>
        <input
          id="consult-account-number"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="Ex: 1001"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value);
            setAccount(null);
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
      {account && (
        <div className="flex flex-col gap-1" style={{ paddingTop: "0.25rem" }}>
          <div className="flex items-center justify-between">
            <span className="term-label">Nº da conta</span>
            <span
              className="tnum"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {account.accountNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="term-label">Tipo</span>
            <span
              className="tnum"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {accountTypeLabels[account.type]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="term-label">Saldo</span>
            <span
              className="tnum"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "1.125rem",
                fontWeight: 700,
                color:
                  account.balance > 0
                    ? "var(--positive)"
                    : account.balance < 0
                      ? "var(--negative)"
                      : "var(--muted)",
              }}
            >
              {formatBRL(account.balance)}
            </span>
          </div>
          {account.type === "bonus" && (
            <div className="flex items-center justify-between">
              <span className="term-label">Pontuação</span>
              <span
                className="tnum"
                style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {(account as BonusAccount).score} pts
              </span>
            </div>
          )}
        </div>
      )}
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}
