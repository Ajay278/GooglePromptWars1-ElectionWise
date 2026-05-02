import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mock the AI agent so components don't make real network calls ─────────────
vi.mock('../src/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/utils')>();
  return {
    ...actual,
    askAgent: vi.fn().mockResolvedValue(
      'VERDICT: True\nEXPLANATION: This claim is accurate based on ECI rules.'
    ),
  };
});

vi.mock('../src/lib/analytics', () => ({
  logAnalyticsEvent: vi.fn(),
}));

vi.mock('../src/lib/firebase', () => ({
  db: {},
}));

import Detector from '../src/pages/Detector';
import { askAgent } from '../src/lib/utils';

// ── Detector Component Tests ──────────────────────────────────────────────────
describe('Detector — Misinformation Checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the heading and textarea', () => {
    render(<Detector />);
    expect(screen.getByRole('heading', { name: /verify election claims/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you can vote online/i)).toBeInTheDocument();
  });

  it('disables the Analyze button when input is empty', () => {
    render(<Detector />);
    const btn = screen.getByRole('button', { name: /analyze claim/i });
    expect(btn).toBeDisabled();
  });

  it('enables the Analyze button when text is entered', async () => {
    render(<Detector />);
    const textarea = screen.getByPlaceholderText(/you can vote online/i);
    await userEvent.type(textarea, 'Voting is online this year');
    const btn = screen.getByRole('button', { name: /analyze claim/i });
    expect(btn).not.toBeDisabled();
  });

  it('calls askAgent with the detector mode when claim is submitted', async () => {
    render(<Detector />);
    const textarea = screen.getByPlaceholderText(/you can vote online/i);
    await userEvent.type(textarea, 'Test election claim');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    await waitFor(() => {
      expect(askAgent).toHaveBeenCalledWith(
        [{ role: 'user', content: 'Test election claim' }],
        expect.any(String),
        expect.any(String),
        'detector'
      );
    });
  });

  it('displays a TRUE verdict correctly', async () => {
    vi.mocked(askAgent).mockResolvedValueOnce(
      'VERDICT: True\nEXPLANATION: The claim is factually correct.'
    );

    render(<Detector />);
    await userEvent.type(screen.getByPlaceholderText(/you can vote online/i), 'A true claim');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    const heading = await screen.findByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/true/i);
    expect(screen.getByText(/factually correct/i)).toBeInTheDocument();
  });

  it('displays a FALSE verdict correctly', async () => {
    vi.mocked(askAgent).mockResolvedValueOnce(
      'VERDICT: False\nEXPLANATION: This claim is completely false.'
    );

    render(<Detector />);
    await userEvent.type(screen.getByPlaceholderText(/you can vote online/i), 'A false claim');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    const heading = await screen.findByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/false/i);
    expect(screen.getByText(/completely false/i)).toBeInTheDocument();
  });

  it('displays a MISLEADING verdict correctly', async () => {
    vi.mocked(askAgent).mockResolvedValueOnce(
      'VERDICT: Misleading\nEXPLANATION: Partially true but lacks context.'
    );

    render(<Detector />);
    await userEvent.type(screen.getByPlaceholderText(/you can vote online/i), 'A misleading claim');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    const heading = await screen.findByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/misleading/i);
    expect(screen.getByText(/lacks context/i)).toBeInTheDocument();
  });

  it('shows an error verdict when the AI response cannot be parsed', async () => {
    vi.mocked(askAgent).mockResolvedValueOnce('Some unexpected response format');

    render(<Detector />);
    await userEvent.type(screen.getByPlaceholderText(/you can vote online/i), 'anything');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('shows error verdict when the network call fails', async () => {
    vi.mocked(askAgent).mockRejectedValueOnce(new Error('Network error'));

    render(<Detector />);
    await userEvent.type(screen.getByPlaceholderText(/you can vote online/i), 'test');
    fireEvent.click(screen.getByRole('button', { name: /analyze claim/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
