import { describe, it, expect, vi, beforeEach } from "vitest";
import { deletePitch, updatePitch } from "../pitchCrud";

// Mock clerk auth
const mockAuth = vi.fn();
vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

// Mock next/navigation and next/cache
const mockRedirect = vi.fn();
const mockRevalidatePath = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}));

// Mock Supabase
const mockDeleteEq2 = vi.fn();
const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 });
const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 });

const mockUpdateEq2 = vi.fn();
const mockUpdateEq1 = vi.fn().mockReturnValue({ eq: mockUpdateEq2 });
const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq1 });

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      delete: () => mockDelete(),
      update: (data: any) => mockUpdate(data),
    }),
  },
}));

describe("pitchCrud actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deletePitch", () => {
    it("should throw error if user is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      await expect(deletePitch("pitch-123")).rejects.toThrow("Unauthorized");
    });

    it("should delete pitch and redirect to dashboard when authenticated", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-456" });
      mockDeleteEq2.mockResolvedValueOnce({ error: null });

      await deletePitch("pitch-123");

      expect(mockDeleteEq1).toHaveBeenCalledWith("id", "pitch-123");
      expect(mockDeleteEq2).toHaveBeenCalledWith("userId", "user-456");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
      expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("updatePitch", () => {
    it("should throw error if user is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      const formData = new FormData();
      await expect(updatePitch("pitch-123", formData)).rejects.toThrow("Unauthorized");
    });

    it("should update pitch fields and revalidate paths", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-456" });
      mockUpdateEq2.mockResolvedValueOnce({ error: null });

      const formData = new FormData();
      formData.set("startupName", "Updated Name");
      formData.set("problem", "Updated Problem");
      formData.set("solution", "Updated Solution");
      formData.set("targetMarket", "Updated Market");

      await updatePitch("pitch-123", formData);

      expect(mockUpdate).toHaveBeenCalledWith({
        startupName: "Updated Name",
        problem: "Updated Problem",
        solution: "Updated Solution",
        targetMarket: "Updated Market",
      });
      expect(mockUpdateEq1).toHaveBeenCalledWith("id", "pitch-123");
      expect(mockUpdateEq2).toHaveBeenCalledWith("userId", "user-456");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/deck/pitch-123");
    });
  });
});
