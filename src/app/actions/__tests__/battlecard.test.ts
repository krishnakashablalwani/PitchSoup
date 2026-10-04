import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateBattlecard } from "../battlecard";

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

describe("generateBattlecard action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should generate competitor battlecard intelligence", async () => {
    const mockBattlecard = {
      competitors: [
        {
          name: "Epic Systems",
          strengths: ["Entrenched legacy hospital base", "Massive market share"],
          weaknesses: ["Clunky 1990s UI", "Zero ambient AI"],
          pricing: "Enterprise ($100k+)",
          marketShare: "50% of US hospital EHRs",
        },
      ],
      ourAdvantages: ["Zero onboarding required", "Runs on mobile", "10x cheaper"],
      positioning: "The ambient AI layer that works with any legacy EHR.",
      talkingPoints: ["We integrate with legacy systems rather than trying to replace them."],
    };

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockBattlecard),
      },
    });

    const result = await generateBattlecard(
      {
        startupName: "HealthAI",
        problem: "Doctor admin time",
        solution: "Voice AI scribe",
        targetMarket: "Clinics",
      },
      "Epic, Cerner"
    );

    expect(result).toBeDefined();
    expect(result.competitors).toHaveLength(1);
    expect(result.competitors[0].name).toBe("Epic Systems");
    expect(result.ourAdvantages).toHaveLength(3);
    expect(result.positioning).toContain("ambient AI layer");
  });

  it("should return null on error", async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("API failure"));

    const result = await generateBattlecard(
      {
        startupName: "Test",
        problem: "Test",
        solution: "Test",
        targetMarket: "Test",
      },
      "Competitor"
    );

    expect(result).toBeNull();
  });
});
