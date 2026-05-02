import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadinessScore from '../src/components/ReadinessScore';
import BottomNav from '../src/components/BottomNav';

// ── Mock Zustand store ────────────────────────────────────────────────────────
const mockStoreState = {
  readinessScore: 50,
  completedTasks: ['eligibility', 'roll', 'booth'],
  toggleTask: vi.fn(),
  language: 'en',
  setLanguage: vi.fn(),
  selectedState: 'All India',
  setSelectedState: vi.fn(),
  messages: [],
  addMessage: vi.fn(),
  clearMessages: vi.fn(),
};

vi.mock('../src/store', () => ({
  useAppStore: () => mockStoreState,
  READINESS_TASKS: [
    { id: 'eligibility', label: 'Checked my eligibility', icon: '✅' },
    { id: 'roll', label: 'Verified my name in voter roll', icon: '📋' },
    { id: 'booth', label: 'Located my polling booth', icon: '📍' },
    { id: 'id', label: 'Arranged valid photo ID', icon: '🪪' },
    { id: 'date', label: 'Know my polling date & time', icon: '📅' },
    { id: 'process', label: 'Understand the voting process', icon: '🗳️' },
  ],
  LANGUAGES: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  ],
  LANG_NAME: { en: 'English', hi: 'Hindi' },
}));

vi.mock('../src/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/utils')>();
  return { ...actual, INDIAN_STATES: ['All India', 'Delhi'] };
});

vi.mock('../src/hooks/useAutoTranslate', () => ({
  useAutoTranslate: (texts: string[]) => ({ translated: texts, isLoading: false }),
}));

// ── ReadinessScore Component Tests ───────────────────────────────────────────
describe('ReadinessScore component', () => {
  it('renders the readiness percentage', () => {
    render(<ReadinessScore />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders the "Ready" label', () => {
    render(<ReadinessScore />);
    expect(screen.getByText(/ready/i)).toBeInTheDocument();
  });

  it('renders all 6 readiness tasks as buttons', () => {
    render(<ReadinessScore />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(6);
  });

  it('renders completed tasks with task labels', () => {
    render(<ReadinessScore />);
    expect(screen.getByText(/checked my eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/verified my name/i)).toBeInTheDocument();
  });

  it('renders with 0% score when no tasks are done', () => {
    mockStoreState.readinessScore = 0;
    mockStoreState.completedTasks = [];
    render(<ReadinessScore />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    mockStoreState.readinessScore = 50;
    mockStoreState.completedTasks = ['eligibility', 'roll', 'booth'];
  });

  it('renders with 100% score when all tasks are done', () => {
    mockStoreState.readinessScore = 100;
    mockStoreState.completedTasks = ['eligibility', 'roll', 'booth', 'id', 'date', 'process'];
    render(<ReadinessScore />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    mockStoreState.readinessScore = 50;
    mockStoreState.completedTasks = ['eligibility', 'roll', 'booth'];
  });
});

// ── BottomNav Component Tests ────────────────────────────────────────────────
describe('BottomNav component', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );
    // Bottom nav should contain anchor/link elements
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders the nav element', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
