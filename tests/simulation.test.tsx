import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Simulation from '../src/pages/Simulation';
import { useAppStore } from '../src/store';
import * as utils from '../src/lib/utils';

vi.mock('../src/lib/utils', () => ({
  askAgent: vi.fn(),
  generateId: vi.fn(() => 'test-id'),
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('Simulation Page', () => {
  beforeEach(() => {
    useAppStore.getState().setLanguage('en');
    vi.clearAllMocks();
  });

  it('starts the simulation when button is clicked', async () => {
    vi.mocked(utils.askAgent).mockResolvedValue('Welcome Officer. Scenario 1...');
    
    render(<Simulation />);
    
    const startButton = screen.getByText(/Start Simulation/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome Officer. Scenario 1.../i)).toBeInTheDocument();
    });
    
    expect(utils.askAgent).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ content: expect.stringContaining('Start the simulation') })]),
      'en',
      'All India',
      'simulation'
    );
  });

  it('allows user to send a decision', async () => {
    vi.mocked(utils.askAgent)
      .mockResolvedValueOnce('Welcome Officer. What is your call?')
      .mockResolvedValueOnce('Good decision. Scenario 2...');
    
    render(<Simulation />);
    
    fireEvent.click(screen.getByText(/Start Simulation/i));
    await waitFor(() => screen.getByPlaceholderText(/What is your decision/i));
    
    const input = screen.getByPlaceholderText(/What is your decision/i);
    const sendButton = screen.getByRole('button', { name: '' }); // The send icon button
    
    fireEvent.change(input, { target: { value: 'I will check IDs' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/I will check IDs/i)).toBeInTheDocument();
      expect(screen.getByText(/Good decision. Scenario 2.../i)).toBeInTheDocument();
    });
  });
});
