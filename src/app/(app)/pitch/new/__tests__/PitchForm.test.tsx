import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PitchForm from '../PitchForm';

// Mock react-dom useFormStatus
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
  };
});

describe('PitchForm (Copilot Wizard)', () => {
  it('should render the first onboarding question', () => {
    render(<PitchForm />);
    expect(screen.getByText("What stage is your startup at?")).toBeInTheDocument();
    expect(screen.getByText("Idea stage")).toBeInTheDocument();
  });

  it('should advance through the wizard and show the main form', async () => {
    render(<PitchForm />);
    
    // Step 1: Stage
    fireEvent.click(screen.getByText("Idea stage"));
    
    // Fast forward through timeouts or manually trigger (if auto-advance has delay, we might need to wait)
    // Wait for step 2: Goal
    await waitFor(() => expect(screen.getByText("What do you need help with first?")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Create a pitch deck"));
    
    // Step 3: Industry
    await waitFor(() => expect(screen.getByText("What industry are you in?")).toBeInTheDocument());
    fireEvent.click(screen.getByText("SaaS / AI"));

    // Step 4: Experience
    await waitFor(() => expect(screen.getByText("How familiar are you with fundraising?")).toBeInTheDocument());
    fireEvent.click(screen.getByText("I'm a first-time founder"));

    // Click "Generate my personalized workflow"
    const generateBtn = await screen.findByText(/Generate my personalized workflow/i);
    fireEvent.click(generateBtn);

    // Verify main form renders
    await waitFor(() => {
      expect(screen.getByText(/Workflow Customized!/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g. NextGen Robotics")).toBeInTheDocument();
    });
  });
});
