"use client";

import { useState } from "react";
import RegisterAccountForm from "@/components/RegisterAccountForm";
import CheckBalanceForm from "@/components/CheckBalanceForm";
import CreditForm from "@/components/CreditForm";
import DebitForm from "@/components/DebitForm";
import TransferForm from "@/components/TransferForm";
import AccountsList from "@/components/AccountsList";
import YieldInterestForm from "@/components/YieldInterestForm";

interface PanelProps {
  tag: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}

function Panel({ tag, accentColor = "var(--hairline)", children, className = "" }: PanelProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-sm p-4 ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <span
        className="panel-tag"
        style={{
          color: accentColor !== "var(--hairline)" ? accentColor : "var(--muted)",
        }}
      >
        {tag}
      </span>
      {children}
    </div>
  );
}

export default function Home() {
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg)", position: "relative", zIndex: 1 }}
    >
      {/* Top strip */}
      <header
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          height: "2.75rem",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            ◈
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), 'IBM Plex Sans Condensed', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "var(--text)",
              textTransform: "uppercase",
            }}
          >
            Sistema Bancário
          </h1>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "var(--muted)",
            letterSpacing: "0.06em",
          }}
        >
          IMD · UFRN
        </span>
      </header>

      {/* Main two-pane layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Operations area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* 3-column grid, 2 rows */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "1fr 1fr",
            }}
          >
            {/* Row 1 */}
            <Panel tag="NOVA CONTA" accentColor="var(--accent)">
              <RegisterAccountForm onChange={refresh} />
            </Panel>

            <Panel tag="SALDO" accentColor="#818cf8">
              <CheckBalanceForm version={version} />
            </Panel>

            <Panel tag="CRÉDITO" accentColor="var(--accent)">
              <CreditForm onChange={refresh} />
            </Panel>

            {/* Row 2 */}
            <Panel tag="DÉBITO" accentColor="var(--danger)">
              <DebitForm onChange={refresh} />
            </Panel>

            <div style={{ gridColumn: "span 2", height: "100%" }}>
              <Panel tag="TRANSFERÊNCIA" accentColor="var(--warn)" className="h-full">
                <TransferForm onChange={refresh} />
              </Panel>
            </div>

            <Panel tag="JUROS" accentColor="var(--accent)">
              <YieldInterestForm onChange={refresh} />
            </Panel>
          </div>
        </main>

        {/* Right rail — permanent, part of flex layout, never overlays */}
        <aside
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: "320px",
            borderLeft: "1px solid var(--hairline)",
            background: "var(--surface)",
          }}
        >
          <AccountsList version={version} />
        </aside>
      </div>
    </div>
  );
}
