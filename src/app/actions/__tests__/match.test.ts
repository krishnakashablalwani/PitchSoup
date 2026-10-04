import { describe, it, expect, vi, beforeEach } from "vitest";
import { findInvestors } from "../match";

const mockGenerateContent = vi.fn();
vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent,
        };
      }
    },
  };
});

describe("findInvestors action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should return recommended VC firms for startup", async () => {
    const mockInvestors = [
      {
        name: "General Catalyst",
        type: "Multi-stage VC",
        thesis: "Health assurance and digital healthcare transformation",
        whyMatch: "Their healthcare fund specializes in hospital and provider efficiency.",
        typicalCheck: "$1M - $5M",
      },
      {
        name: "Andreessen Horowitz (Bio + Health)",
        type: "Early & Growth",
        thesis: "AI-native biology and clinical workflows",
        whyMatch: "Leader in funding AI voice scribes and clinical agents.",
        typicalCheck: "$2M - $10M",
      },
    ];

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockInvestors),
      },
    });

    const result = await findInvestors({
      startupName: "HealthAI",
      problem: "EHR burden",
      solution: "Voice AI",
      targetMarket: "Clinics",
      businessModel: "B2B SaaS",
    });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("General Catalyst");
    expect(result[1].name).toContain("Andreessen Horowitz");
  });

  it("should return empty array on failure", async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("Network timeout"));

    const result = await findInvestors({
      startupName: "ErrorApp",
      problem: "N/A",
      solution: "N/A",
      targetMarket: "N/A",
    });

    expect(result).toEqual([]);
  });
});
