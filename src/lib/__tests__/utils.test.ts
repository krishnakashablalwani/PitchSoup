import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (tailwind merge and clsx)", () => {
  it("should merge simple class strings", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should resolve conflicting tailwind classes cleanly", () => {
    // text-blue-500 should override text-red-500
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    // p-4 should override p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("should handle conditionals and undefined values", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base-class", isActive && "active", isDisabled && "disabled", undefined, null)).toBe(
      "base-class active"
    );
  });
});
