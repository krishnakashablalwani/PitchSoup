import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PublicPitchViewer from "../PublicPitchViewer";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock framer-motion to render children directly
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("PublicPitchViewer Component", () => {
  const mockPitch = {
    id: "pitch-123",
    startupName: "SoupAI",
    problem: "Founders spend 50 hours designing pitch decks.",
    solution: "AI cooks a 10-slide VC deck in 30 seconds.",
    targetMarket: "100k early-stage founders globally",
    traction: "$15k MRR, 120 paying startups",
    createdAt: "2026-03-01T00:00:00Z",
  };

  const mockSlides = [
    {
      title: "1. The Vision",
      content: ["Hyper-efficient pitch decks", "Instant deck intelligence"],
    },
    {
      title: "2. The Problem",
      content: ["Deck creation is broken", "Design agencies charge $5,000"],
    },
    {
      title: "3. The Secret Sauce",
      content: ["Proprietary LLM prompts", "Real-time mock VC simulator"],
    },
  ];

  it("renders startup information and the first slide correctly", () => {
    render(<PublicPitchViewer pitch={mockPitch} slides={mockSlides} />);

    expect(screen.getByText("SoupAI")).toBeInTheDocument();
    expect(screen.getByText("1. The Vision")).toBeInTheDocument();
    expect(screen.getByText("Hyper-efficient pitch decks")).toBeInTheDocument();
    expect(screen.getByText(/Slide 1 of 3/i)).toBeInTheDocument();
  });

  it("navigates through slides with next and previous controls", () => {
    render(<PublicPitchViewer pitch={mockPitch} slides={mockSlides} />);

    const prevBtn = screen.getByTitle("Previous slide");
    const nextBtn = screen.getByTitle("Next slide");

    // Initially at slide 1, previous should be disabled
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    // Click next slide
    fireEvent.click(nextBtn);
    expect(screen.getByText("2. The Problem")).toBeInTheDocument();
    expect(screen.getByText(/Slide 2 of 3/i)).toBeInTheDocument();
    expect(prevBtn).not.toBeDisabled();

    // Click next slide again to go to the last slide
    fireEvent.click(nextBtn);
    expect(screen.getAllByText("3. The Secret Sauce")[0]).toBeInTheDocument();
    expect(screen.getByText(/Slide 3 of 3/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();

    // Click previous slide
    fireEvent.click(prevBtn);
    expect(screen.getByText("2. The Problem")).toBeInTheDocument();
  });

  it("falls back to default problem/solution slides when slides array is empty", () => {
    render(<PublicPitchViewer pitch={mockPitch} slides={[]} />);

    expect(screen.getByText("THE PROBLEM")).toBeInTheDocument();
    expect(
      screen.getAllByText("Founders spend 50 hours designing pitch decks.")
    ).toHaveLength(2);
    expect(screen.getByText(/Slide 1 of 2/i)).toBeInTheDocument();
  });

  it("opens and handles contact founder modal submission", () => {
    render(<PublicPitchViewer pitch={mockPitch} slides={mockSlides} />);

    // Click "Request Intro / Contact" button
    const openContactBtn = screen.getByRole("button", {
      name: /Request Intro \/ Contact/i,
    });
    fireEvent.click(openContactBtn);

    // Modal should be open with "Contact Founder" title
    expect(screen.getByText("Contact Founder")).toBeInTheDocument();

    // Fill form
    const nameInput = screen.getByPlaceholderText("e.g. Sarah Connor / Cyberdyne Ventures");
    const emailInput = screen.getByPlaceholderText("name@firm.com");
    const messageInput = screen.getByPlaceholderText(
      "We'd love to learn more about your traction and discuss a seed ticket..."
    );
    fireEvent.change(nameInput, { target: { value: "Jane VC" } });
    fireEvent.change(emailInput, { target: { value: "jane@greylock.com" } });
    fireEvent.change(messageInput, { target: { value: "Excited about your deck!" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Send Intro Inquiry/i });
    fireEvent.click(submitBtn);

    // Should display success confirmation
    expect(screen.getByText("Intro Request Sent")).toBeInTheDocument();
  });
});
