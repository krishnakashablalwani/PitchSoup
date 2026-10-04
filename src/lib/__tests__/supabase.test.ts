import { describe, it, expect, vi } from "vitest";
import { createClerkSupabaseClient, supabase, supabaseAdmin } from "../supabase";

describe("supabase client initialization", () => {
  it("should initialize default client and admin client", () => {
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabaseAdmin).toBeDefined();
    expect(supabaseAdmin.from).toBeDefined();
  });

  it("should create standard client when token is empty", () => {
    const client = createClerkSupabaseClient("");
    expect(client).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it("should attach Bearer authorization header when clerkToken is provided", () => {
    const client = createClerkSupabaseClient("jwt-test-token-123");
    expect(client).toBeDefined();
    // Verify client has authorization header configured
    // @ts-expect-error accessing private property for test verification
    const authHeader = client.headers?.Authorization;
    expect(authHeader).toBe("Bearer jwt-test-token-123");
  });
});
