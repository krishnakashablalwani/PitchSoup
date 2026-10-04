import { describe, it, expect } from "vitest";

describe("Runway Calculator Math Logic", () => {
  function calculateRunway({
    cashInBank,
    monthlyBurn,
    monthlyRevenue,
    revenueGrowth,
  }: {
    cashInBank: number;
    monthlyBurn: number;
    monthlyRevenue: number;
    revenueGrowth: number;
  }) {
    const projections: Array<{ month: number; cash: number; revenue: number; netBurn: number }> = [];
    let cash = cashInBank;
    let rev = monthlyRevenue;
    let runwayMonths = 0;

    for (let m = 1; m <= 36; m++) {
      const netBurn = monthlyBurn - rev;
      cash -= netBurn;
      if (cash <= 0 && runwayMonths === 0) {
        runwayMonths = m - 1;
      }
      projections.push({ month: m, cash: Math.max(0, cash), revenue: rev, netBurn });
      rev = rev * (1 + revenueGrowth / 100);
    }

    if (runwayMonths === 0) runwayMonths = 36;

    return { projections, runwayMonths };
  }

  it("should calculate zero-revenue linear runway correctly", () => {
    // $100k in bank, $25k monthly burn, $0 revenue -> 4 months of runway
    const result = calculateRunway({
      cashInBank: 100000,
      monthlyBurn: 25000,
      monthlyRevenue: 0,
      revenueGrowth: 0,
    });

    // At month 4 cash reaches 0, so 3 months until depletion condition triggers
    expect(result.runwayMonths).toBe(3);
    expect(result.projections[3].cash).toBe(0); // Month 4 cash hits 0
    expect(result.projections[4].cash).toBe(0); // Month 5 clamped to 0
  });

  it("should calculate extended runway when revenue offsets burn and grows", () => {
    // $500k in bank, $40k burn, $10k initial revenue growing 10% monthly
    const result = calculateRunway({
      cashInBank: 500000,
      monthlyBurn: 40000,
      monthlyRevenue: 10000,
      revenueGrowth: 10,
    });

    // Month 1 net burn is 40k - 10k = 30k
    expect(result.projections[0].netBurn).toBe(30000);
    expect(result.projections[0].cash).toBe(470000);

    // Month 2 revenue is 10k * 1.1 = 11,000; net burn = 29,000
    expect(result.projections[1].revenue).toBeCloseTo(11000, 1);
    expect(result.projections[1].netBurn).toBeCloseTo(29000, 1);

    // Runway should extend past 12.5 months (which would be the zero-rev runway)
    expect(result.runwayMonths).toBeGreaterThan(12);
  });

  it("should handle default cap of 36 months when business is default alive", () => {
    // $1M in bank, $10k burn, $50k revenue (profitable)
    const result = calculateRunway({
      cashInBank: 1000000,
      monthlyBurn: 10000,
      monthlyRevenue: 50000,
      revenueGrowth: 5,
    });

    expect(result.runwayMonths).toBe(36);
    expect(result.projections[0].netBurn).toBe(-40000); // Net positive cash flow
    expect(result.projections[0].cash).toBe(1040000);
  });
});
