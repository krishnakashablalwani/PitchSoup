import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import SimulatorPage from '../page';

// Mock chatWithCoach server action
vi.mock('@/app/actions/simulator', () => ({
  chatWithCoach: vi.fn().mockResolvedValue("That's a good answer, but what about churn?"),
}));

// Mock React.use for Next.js 15 Promise params
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    use: (promise: Promise<any>) => {
      // Very naive mock for React.use unwrapping a simple resolved object
      // For this test, we assume the promise resolves to { id: 'test123' } synchronously for render
      return { id: 'test123' }; 
    }
  };
});

describe('SimulatorPage (Q&A History)', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load history from localStorage if it exists', async () => {
    const mockHistory = [
      { role: "coach", text: "What is your MRR?" },
      { role: "founder", text: "We are at $10k MRR." }
    ];
    localStorage.setItem('pitchsoup_simulator_test123', JSON.stringify(mockHistory));
    
    // Simulate Promise params for React 'use'
    const params = Promise.resolve({ id: 'test123' });
    
    render(<SimulatorPage params={params} />);
    
    // Wait for localStorage useEffect to fire
    await waitFor(() => {
      expect(screen.getByText("What is your MRR?")).toBeInTheDocument();
      expect(screen.getByText("We are at $10k MRR.")).toBeInTheDocument();
    });
  });

  it('should allow clearing history', async () => {
    const mockHistory = [
      { role: "coach", text: "What is your MRR?" }
    ];
    localStorage.setItem('pitchsoup_simulator_test123', JSON.stringify(mockHistory));
    
    const params = Promise.resolve({ id: 'test123' });
    render(<SimulatorPage params={params} />);
    
    await waitFor(() => {
      expect(screen.getByText("What is your MRR?")).toBeInTheDocument();
    });
    
    // Click clear history
    const clearBtn = screen.getByText("Clear History");
    fireEvent.click(clearBtn);
    
    // Should show start simulation UI
    expect(screen.getByText("Ready to Prepare Your Pitch?")).toBeInTheDocument();
    expect(localStorage.getItem('pitchsoup_simulator_test123')).toBeNull();
  });
});
