import { describe, it, expect, vi, beforeEach } from "vitest";
import { scorePitch } from "../score";

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

describe("scorePitch action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should score pitch across 6 VC dimensions and calculate overall score", async () => {
    const mockScorecard = {
      overallScore: 8.2,
      dimensions: [
        { name: "Problem Clarity", score: 9, justification: "Well defined pain point.", tip: "Add hard stats." },
        { name: "Solution Fit", score: 8, justification: "Strong technology alignment.", tip: "Clarify integration." },
        { name: "Market Size", score: 8, justification: "Growing TAM.", tip: "Break down SOM." },
        { name: "Differentiation", score: 7, justification: "Good but competition is fierce.", tip: "Highlight IP." },
        { name: "Scalability", score: 9, justification: "Software margins.", tip: "Focus on distribution." },
        { name: "Pitch Quality", score: 8, justification: "Clear narrative flow.", tip: "Sharpen hook." },
      ],
      summary: "A compelling B2B SaaS pitch with high potential.",
    };

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockScorecard),
      },
    });

    const result = await scorePitch({
      startupName: "CloudScale",
      problem: "Infrastructure costs",
      solution: "Auto-optimizer",
      targetMarket: "SaaS companies",
    });

    expect(result).toBeDefined();
    expect(result?.overallScore).toBe(8.2);
    expect(result?.dimensions).toHaveLength(6);
    expect(result?.dimensions[0].name).toBe("Problem Clarity");
  });

  it("should return null if API call fails", async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("Gemini quota exceeded"));

    const result = await scorePitch({
      startupName: "FailApp",
      problem: "Test",
      solution: "Test",
      targetMarket: "Test",
    });

    expect(result).toBeNull();
  });
});
