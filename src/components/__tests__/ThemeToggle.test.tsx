import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "../ThemeToggle";

// Mock next-themes
const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "light";
  });

  it("renders the toggle button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("toggles theme to dark when current theme is light", () => {
    mockTheme = "light";
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles theme to light when current theme is dark", () => {
    mockTheme = "dark";
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(button);
    
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
