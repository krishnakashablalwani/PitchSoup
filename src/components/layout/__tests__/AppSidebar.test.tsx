import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppSidebar } from "../AppSidebar";

// Mock dependencies
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

const mockSignOut = vi.fn();
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      firstName: "TestUser",
      imageUrl: "https://test.url/avatar.png",
    },
  }),
  useAuth: () => ({
    signOut: mockSignOut,
  }),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <button>Mock Theme Toggle</button>,
}));

describe("AppSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sidebar with correct user info", () => {
    render(<AppSidebar />);
    
    // Check if the logo is present
    expect(screen.getByText("PitchSoup")).toBeInTheDocument();
    
    // Check if user info is present
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("Workspace Admin")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<AppSidebar />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("New Pitch")).toBeInTheDocument();
    expect(screen.getByText("Pitch Q&A")).toBeInTheDocument();
  });

  it("toggles the profile menu when clicking the user profile button", () => {
    render(<AppSidebar />);
    
    // Menu shouldn't be open initially
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    
    // Click the user profile button
    const userButton = screen.getByText("TestUser").closest("button");
    fireEvent.click(userButton!);
    
    // Menu should be open
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    
    // Click Sign Out
    fireEvent.click(screen.getByText("Sign Out"));
    expect(mockSignOut).toHaveBeenCalledWith({ redirectUrl: "/" });
  });
});
