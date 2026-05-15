"use client";

import { accounts } from "@/store/accountStore";
import { BonusAccount } from "@/interfaces/account";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

interface AccountsListProps {
  version?: number;
}

export default function AccountsList({ version: _ }: AccountsListProps) {
  const rows = Array.from(accounts.values()).sort((a, b) => a.accountNumber - b.accountNumber);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard não disponível em http sem secure context — ignora
    }
  }

  const count = rows.length;

  return (
    <>
      {/* Sticky rail header */}
      <div
        className="shrink-0 flex items-center justify-between px-4"
        style={{
          height: "2.75rem",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Contas
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            fontWeight: 700,
            color: count > 0 ? "var(--accent)" : "var(--muted)",
            letterSpacing: "0.06em",
          }}
        >
          {count} {count === 1 ? "total" : "total"}
        </span>
      </div>

      {/* Scrollable account list */}
      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "var(--muted)",
              textAlign: "center",
              padding: "2rem 1.5rem",
            }}
          >
            Nenhuma conta
            <br />
            cadastrada
          </div>
        ) : (
          <div className="flex flex-col">
            {rows.map((account, idx) => (
              <div
                key={account.accountNumber}
                style={{
                  borderBottom: idx < rows.length - 1 ? "1px solid var(--hairline)" : "none",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  background: "transparent",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {/* Left: account number */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "0.6875rem",
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "0.125rem",
                    }}
                  >
                    Conta
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {account.accountNumber}
                  </div>
                </div>

                {/* Right: balance + score (bônus) + copy */}
                <div className="flex flex-col items-end gap-1">
                  <div
                    className="tnum"
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color:
                        account.balance > 0
                          ? "var(--positive)"
                          : account.balance < 0
                            ? "var(--negative)"
                            : "var(--muted)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {formatBRL(account.balance)}
                  </div>
                  {account.type === "bonus" && (
                    <div
                      style={{
                        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        color: "var(--accent)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {(account as BonusAccount).score} pts
                    </div>
                  )}
                  <button
                    type="button"
                    title="Copiar número da conta"
                    onClick={() => copyToClipboard(String(account.accountNumber))}
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      background: "transparent",
                      border: "1px solid var(--hairline)",
                      borderRadius: "3px",
                      padding: "0.125rem 0.375rem",
                      cursor: "pointer",
                      transition: "color 0.1s ease, border-color 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.color = "var(--accent)";
                      el.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.color = "var(--muted)";
                      el.style.borderColor = "var(--hairline)";
                    }}
                  >
                    copiar nº
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
