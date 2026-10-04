import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateElevatorPitch } from "../elevatorPitch";

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

describe("generateElevatorPitch action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should generate all 4 verbal scripts and key talking points", async () => {
    const mockScripts = {
      cocktailHook: "We help doctors reclaim 2 hours of their day by automating EHR updates with voice AI.",
      elevator30s: "Physicians waste 30% of their day on administrative burdens. HealthAI sits quietly in the background, listening to patient consults and auto-filling EHR records with zero clicks.",
      speedPitch60s: "Healthcare is suffering from severe burnout. HealthAI is an ambient AI medical scribe with 5 pilot clinics and 20 paying doctors. We are raising $1M to expand to 50 clinics.",
      demoDayScript2Min: "[Walk confidently to center stage] In 2026, doctors spend more time looking at screens than looking at patients. [Pause for effect] Today, we are changing that.",
      keyTalkingPoints: ["Saves 2 hours/day", "$200/mo SaaS pricing", "5 pilot clinics active", "Ambient audio transcription"],
    };

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(mockScripts),
      },
    });

    const result = await generateElevatorPitch({
      startupName: "HealthAI",
      problem: "Paperwork burnout",
      solution: "Voice AI scribe",
      targetMarket: "Clinics",
      businessModel: "B2B SaaS",
      traction: "5 pilot clinics",
      fundraisingAsk: "$1M seed",
    });

    expect(result).toBeDefined();
    expect(result?.cocktailHook).toContain("reclaim 2 hours");
    expect(result?.demoDayScript2Min).toContain("[Walk confidently to center stage]");
    expect(result?.keyTalkingPoints).toHaveLength(4);
  });

  it("should return null gracefully on network or JSON parsing error", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => "INVALID NON-JSON RESPONSE",
      },
    });

    const result = await generateElevatorPitch({
      startupName: "BadJson",
      problem: "test",
      solution: "test",
      targetMarket: "test",
    });

    expect(result).toBeNull();
  });
});
