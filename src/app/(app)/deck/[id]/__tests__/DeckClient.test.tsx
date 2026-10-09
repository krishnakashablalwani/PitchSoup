import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeckClient from '../DeckClient';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    getVoices: () => [],
    cancel: vi.fn(),
    speak: vi.fn(),
  },
  writable: true
});

const mockPitch = { id: 'pitch123', startupName: 'TestCo' };
const mockDeckData = [
  { title: 'Slide 1', content: ['Point A'], speakerNotes: 'Notes A' }
];

describe('DeckClient (Editable Slides & Version History)', () => {
  it('should render the slide content as contentEditable', () => {
    render(<DeckClient pitch={mockPitch} deckData={mockDeckData} />);
    
    const titleEl = screen.getByText('Slide 1');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveAttribute('contentEditable', 'true');
    
    const contentEl = screen.getByText('Point A');
    expect(contentEl).toBeInTheDocument();
    expect(contentEl).toHaveAttribute('contentEditable', 'true');
  });

  it('should open Version History modal', () => {
    render(<DeckClient pitch={mockPitch} deckData={mockDeckData} />);
    
    // Open more menu
    const moreActionsBtn = screen.getByTitle('More Actions');
    fireEvent.click(moreActionsBtn);
    
    // Click Version History
    const versionHistoryBtn = screen.getByText('Version History');
    fireEvent.click(versionHistoryBtn);
    
    // Verify modal is shown
    expect(screen.getByText('Version History & Comparison')).toBeInTheDocument();
    expect(screen.getByText('v3: Current (Editable)')).toBeInTheDocument();
  });
});
