import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../generate-email/route";
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

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: () => mockSelect(),
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

describe("POST /api/generate-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("should return 401 if unauthenticated", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const req = new NextRequest("http://localhost:3000/api/generate-email", {
      method: "POST",
      body: JSON.stringify({ pitchId: "1", targetVC: "Sequoia" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 if parameters are missing", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user-1" });

    const req = new NextRequest("http://localhost:3000/api/generate-email", {
      method: "POST",
      body: JSON.stringify({ pitchId: "1" }), // missing targetVC
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should generate tailored cold outreach email", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user-1" });

    mockSingle.mockResolvedValueOnce({
      data: {
        id: "pitch-1",
        startupName: "HealthAI",
        problem: "Doctor paperwork",
        solution: "Voice AI",
        targetMarket: "Clinics",
      },
      error: null,
    });

    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => "Subject: Quick question re HealthAI & Sequoia portfolio\n\nHi Roelof,\n...",
      },
    });

    const req = new NextRequest("http://localhost:3000/api/generate-email", {
      method: "POST",
      body: JSON.stringify({ pitchId: "pitch-1", targetVC: "Sequoia Capital" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.email).toContain("Subject: Quick question");
  });
});
