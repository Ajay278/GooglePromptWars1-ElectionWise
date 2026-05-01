import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, READINESS_TASKS } from '../src/store/index';

describe('Voter Readiness Store', () => {
  beforeEach(() => {
    useAppStore.setState({ language: 'en', selectedState: 'All India', completedTasks: [], readinessScore: 0, messages: [] });
  });

  it('initializes with a score of 0 and no completed tasks', () => {
    const state = useAppStore.getState();
    expect(state.readinessScore).toBe(0);
    expect(state.completedTasks.length).toBe(0);
  });

  it('updates the score correctly when a task is toggled', () => {
    const { toggleTask } = useAppStore.getState();
    
    toggleTask(READINESS_TASKS[0].id);
    let state = useAppStore.getState();
    expect(state.completedTasks).toContain(READINESS_TASKS[0].id);
    expect(state.readinessScore).toBeGreaterThan(0);

    toggleTask(READINESS_TASKS[0].id);
    state = useAppStore.getState();
    expect(state.completedTasks).not.toContain(READINESS_TASKS[0].id);
    expect(state.readinessScore).toBe(0);
  });

  it('updates the language and selected state correctly', () => {
    const { setLanguage, setSelectedState } = useAppStore.getState();
    
    setLanguage('hi');
    expect(useAppStore.getState().language).toBe('hi');

    setSelectedState('Tamil Nadu');
    expect(useAppStore.getState().selectedState).toBe('Tamil Nadu');
  });
});
