import { describe, it, expect } from "vitest";

describe("Cap Table Math Logic", () => {
  function calculateCapTable({
    founders,
    optionPool,
    preMoney,
    investment,
  }: {
    founders: Array<{ name: string; initialEquity: number }>;
    optionPool: number;
    preMoney: number;
    investment: number;
  }) {
    const totalInitialEquity =
      founders.reduce((acc, f) => acc + (f.initialEquity || 0), 0) + optionPool;
    const isBalanced = totalInitialEquity === 100;

    const postMoney = preMoney + investment;
    const dilutionPercent = postMoney === 0 ? 0 : investment / postMoney;
    const retentionMultiplier = 1 - dilutionPercent;
    const investorEquity = dilutionPercent * 100;

    const postInvestmentFounders = founders.map((f) => ({
      name: f.name,
      preEquity: f.initialEquity,
      postEquity: f.initialEquity * retentionMultiplier,
      postMoneyValue: postMoney * ((f.initialEquity * retentionMultiplier) / 100),
    }));

    const postOptionPool = optionPool * retentionMultiplier;

    return {
      totalInitialEquity,
      isBalanced,
      postMoney,
      dilutionPercent,
      investorEquity,
      postOptionPool,
      postInvestmentFounders,
    };
  }

  it("should calculate standard Series Seed 20% dilution accurately", () => {
    const result = calculateCapTable({
      founders: [
        { name: "Alice", initialEquity: 50 },
        { name: "Bob", initialEquity: 40 },
      ],
      optionPool: 10,
      preMoney: 4000000,
      investment: 1000000,
    });

    expect(result.totalInitialEquity).toBe(100);
    expect(result.isBalanced).toBe(true);
    expect(result.postMoney).toBe(5000000);
    expect(result.investorEquity).toBe(20); // 1M / 5M = 20%

    // Alice should dilute from 50% to 40% (50 * 0.8)
    expect(result.postInvestmentFounders[0].postEquity).toBe(40);
    expect(result.postInvestmentFounders[0].postMoneyValue).toBe(2000000); // 40% of 5M

    // Bob should dilute from 40% to 32% (40 * 0.8)
    expect(result.postInvestmentFounders[1].postEquity).toBe(32);
    expect(result.postInvestmentFounders[1].postMoneyValue).toBe(1600000); // 32% of 5M

    // Option pool should dilute from 10% to 8%
    expect(result.postOptionPool).toBe(8);

    // Sum of all post-money percentages: 40 + 32 + 8 + 20 = 100%
    const totalPost =
      result.postInvestmentFounders.reduce((acc, f) => acc + f.postEquity, 0) +
      result.postOptionPool +
      result.investorEquity;
    expect(totalPost).toBe(100);
  });

  it("should flag unbalanced cap tables when initial equity does not equal 100%", () => {
    const result = calculateCapTable({
      founders: [{ name: "Solo Founder", initialEquity: 60 }],
      optionPool: 10,
      preMoney: 5000000,
      investment: 1000000,
    });

    expect(result.totalInitialEquity).toBe(70);
    expect(result.isBalanced).toBe(false);
  });

  it("should safely handle zero valuation or zero investment edge cases", () => {
    const result = calculateCapTable({
      founders: [{ name: "Founder", initialEquity: 100 }],
      optionPool: 0,
      preMoney: 0,
      investment: 0,
    });

    expect(result.postMoney).toBe(0);
    expect(result.dilutionPercent).toBe(0);
    expect(result.investorEquity).toBe(0);
    expect(result.postInvestmentFounders[0].postEquity).toBe(100);
  });
});
