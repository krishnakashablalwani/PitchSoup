"use client";

import { useState } from "react";
import { exportAsCSV } from "@/lib/export";

export default function RunwayPage() {
  const [cashInBank, setCashInBank] = useState<number | "">(500000);
  const [monthlyBurn, setMonthlyBurn] = useState<number | "">(40000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | "">(5000);
  const [revenueGrowth, setRevenueGrowth] = useState<number | "">(10); 
  const [currency, setCurrency] = useState("USD");

  const currencies: Record<string, { symbol: string; locale: string }> = {
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    INR: { symbol: "₹", locale: "en-IN" },
  };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(currencies[currency].locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  
  const projections: { month: number; cash: number; revenue: number; netBurn: number }[] = [];
  let cash = Number(cashInBank) || 0;
  let rev = Number(monthlyRevenue) || 0;
  let runwayMonths = 0;
  const numMonthlyBurn = Number(monthlyBurn) || 0;
  const numRevenueGrowth = Number(revenueGrowth) || 0;

  for (let m = 1; m <= 36; m++) {
    const netBurn = numMonthlyBurn - rev;
    cash -= netBurn;
    if (cash <= 0 && runwayMonths === 0) {
      runwayMonths = m - 1;
    }
    projections.push({ month: m, cash: Math.max(0, cash), revenue: rev, netBurn });
    rev = rev * (1 + numRevenueGrowth / 100);
  }

  if (runwayMonths === 0) runwayMonths = 36; 

  const maxCash = Math.max(Number(cashInBank) || 0, ...projections.map((p) => p.cash));

  const handleExportCSV = () => {
    exportAsCSV(
      projections.map((p) => ({
        Month: p.month,
        "Cash Remaining": Math.round(p.cash),
        "Monthly Revenue": Math.round(p.revenue),
        "Net Burn": Math.round(p.netBurn),
      })),
      "runway-projection"
    );
  };

  return (
    <div className="flex-1 p-6 md:p-10 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline-xl font-bold tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">speed</span>
              Runway Calculator
            </h1>
            <p className="text-muted-foreground mt-2 text-lg font-body-md">
              See exactly when you run out of cash — and how growth changes the timeline.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-foreground/5 border border-border rounded-xl px-4 py-2.5 font-mono-data focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.keys(currencies).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="glass-panel rounded-3xl p-8 space-y-6">
            <h2 className="font-headline-md font-semibold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              Parameters
            </h2>
            {[
              { label: "Cash in Bank", value: cashInBank, set: setCashInBank },
              { label: "Monthly Burn Rate", value: monthlyBurn, set: setMonthlyBurn },
              { label: "Monthly Revenue", value: monthlyRevenue, set: setMonthlyRevenue },
            ].map((input) => (
              <div key={input.label}>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {input.label}
                </label>
                <div className="flex items-center bg-foreground/5 border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
                  <span className="text-muted-foreground font-bold">{currencies[currency].symbol}</span>
                  <input
                    type="number"
                    value={input.value}
                    onChange={(e) => input.set(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-transparent p-3 focus:outline-none font-mono-data text-lg"
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Monthly Revenue Growth (%)
              </label>
              <div className="flex items-center bg-foreground/5 border border-border rounded-xl px-4 focus-within:border-primary transition-colors">
                <input
                  type="number"
                  value={revenueGrowth}
                  onChange={(e) => setRevenueGrowth(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-transparent p-3 focus:outline-none font-mono-data text-lg"
                />
                <span className="text-muted-foreground font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Visual & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Runway Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel rounded-2xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Runway</p>
                <p className={`text-4xl font-headline-xl font-bold ${runwayMonths <= 6 ? "text-destructive" : runwayMonths <= 12 ? "text-yellow-500" : "text-green-500"}`}>
                  {runwayMonths >= 36 ? "36+" : runwayMonths}
                </p>
                <p className="text-sm text-muted-foreground">months</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Net Burn</p>
                <p className="text-3xl font-mono-data font-bold text-destructive">{formatMoney(numMonthlyBurn - (Number(monthlyRevenue) || 0))}</p>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>
              <div className="glass-panel rounded-2xl p-6 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Break-even Revenue</p>
                <p className="text-3xl font-mono-data font-bold text-primary">{formatMoney(numMonthlyBurn)}</p>
                <p className="text-sm text-muted-foreground">/month needed</p>
              </div>
            </div>

            {/* Chart */}
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="font-headline-md font-semibold mb-6">Cash Depletion Timeline</h3>
              <div className="flex items-end gap-[2px] h-48">
                {projections.slice(0, 24).map((p, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all group relative"
                    style={{
                      height: `${Math.max(2, (p.cash / maxCash) * 100)}%`,
                      backgroundColor:
                        p.cash <= 0
                          ? "var(--destructive, #ef4444)"
                          : i < runwayMonths
                          ? "rgba(204, 204, 255, 0.6)"
                          : "rgba(204, 204, 255, 0.15)",
                    }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      M{p.month}: {formatMoney(p.cash)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono-data">
                <span>Month 1</span>
                <span>Month 12</span>
                <span>Month 24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
