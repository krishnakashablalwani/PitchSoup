import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../generate-deck/route";
import { NextRequest } from "next/server";

// Mock Clerk auth
const mockAuth = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

// Mock Supabase
const mockSingle = vi.fn();
const mockIn = vi.fn().mockReturnValue({ single: mockSingle });
const mockOr = vi.fn().mockReturnValue({ single: mockSingle });
const mockEq = vi.fn().mockReturnValue({ in: mockIn, or: mockOr, single: mockSingle });
const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: () => mockSelect(),
      update: (data: any) => mockUpdate(data),
    }),
  },
}));

// Mock Gemini
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

describe("POST /api/generate-deck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should return 401 if unauthorized", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const req = new NextRequest("http://localhost:3000/api/generate-deck", {
      method: "POST",
      body: JSON.stringify({ pitchId: "123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 if pitchId is missing", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user-1" });

    const req = new NextRequest("http://localhost:3000/api/generate-deck", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return cached deck immediately if pitch already has deckData", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user-1" });

    const cachedSlides = [{ slideNumber: 1, title: "Cached Slide" }];
    mockSingle.mockResolvedValueOnce({
      data: {
        id: "pitch-1",
        deckData: JSON.stringify(cachedSlides),
      },
      error: null,
    });

    const req = new NextRequest("http://localhost:3000/api/generate-deck", {
      method: "POST",
      body: JSON.stringify({ pitchId: "pitch-1" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(cachedSlides);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it("should generate deck with Gemini and save to DB when deckData is absent", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user-1" });

    mockSingle.mockResolvedValueOnce({
      data: {
        id: "pitch-1",
        startupName: "SoupAI",
        problem: "Hard to pitch",
        solution: "Pitch coach",
        targetMarket: "Founders",
        deckData: null,
      },
      error: null,
    });

    const generatedDeck = {
      startupName: "SoupAI",
      oneLiner: "Pitch faster",
      slides: [{ slideNumber: 1, title: "Problem" }],
    };

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify(generatedDeck),
      },
    });

    const req = new NextRequest("http://localhost:3000/api/generate-deck", {
      method: "POST",
      body: JSON.stringify({ pitchId: "pitch-1" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.startupName).toBe("SoupAI");
    expect(mockUpdate).toHaveBeenCalledWith({ deckData: JSON.stringify(generatedDeck) });
    expect(mockUpdateEq).toHaveBeenCalledWith("id", "pitch-1");
  });
});
