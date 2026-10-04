import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../webhooks/clerk/route";

// Mock next/headers
const mockGetHeader = vi.fn();
vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (key: string) => mockGetHeader(key),
  }),
}));

// Mock svix Webhook
const mockVerify = vi.fn();
vi.mock("svix", () => ({
  Webhook: class {
    verify = mockVerify;
  },
}));

// Mock Supabase
const mockUpsert = vi.fn();
const mockDeleteEq = vi.fn();
const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq });

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn().mockReturnValue({
      upsert: (data: any) => mockUpsert(data),
      delete: () => mockDelete(),
    }),
  },
}));

describe("POST /api/webhooks/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_WEBHOOK_SECRET = "whsec_test_secret_123";
  });

  it("should return 400 if svix headers are missing", async () => {
    mockGetHeader.mockReturnValue(null);

    const req = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should sync user creation to Supabase on user.created event", async () => {
    mockGetHeader.mockImplementation((key: string) => {
      if (key === "svix-id") return "msg_123";
      if (key === "svix-timestamp") return "123456789";
      if (key === "svix-signature") return "v1,signature";
      return null;
    });

    mockVerify.mockReturnValueOnce({
      type: "user.created",
      data: {
        id: "clerk_user_999",
        email_addresses: [{ email_address: "founder@pitchsoup.com" }],
        first_name: "Ada",
        last_name: "Lovelace",
        image_url: "https://avatar.test/ada.png",
      },
    });

    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith({
      id: "clerk_user_999",
      email: "founder@pitchsoup.com",
      first_name: "Ada",
      last_name: "Lovelace",
      avatar_url: "https://avatar.test/ada.png",
    });
  });

  it("should remove user from Supabase on user.deleted event", async () => {
    mockGetHeader.mockImplementation((key: string) => {
      if (key === "svix-id") return "msg_123";
      if (key === "svix-timestamp") return "123456789";
      if (key === "svix-signature") return "v1,signature";
      return null;
    });

    mockVerify.mockReturnValueOnce({
      type: "user.deleted",
      data: {
        id: "clerk_user_999",
      },
    });

    mockDeleteEq.mockResolvedValueOnce({ error: null });

    const req = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockDeleteEq).toHaveBeenCalledWith("id", "clerk_user_999");
  });
});
