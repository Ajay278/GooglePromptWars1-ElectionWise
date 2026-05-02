import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAppStore, READINESS_TASKS, LANGUAGES, LANG_NAME } from '../src/store/index';

describe('Voter Readiness Store', () => {
  beforeEach(() => {
    useAppStore.setState({
      language: 'en',
      selectedState: 'All India',
      completedTasks: [],
      readinessScore: 0,
      messages: [],
    });
  });

  it('initializes with a score of 0 and no completed tasks', () => {
    const state = useAppStore.getState();
    expect(state.readinessScore).toBe(0);
    expect(state.completedTasks.length).toBe(0);
  });

  it('updates the score correctly when a task is toggled on', () => {
    const { toggleTask } = useAppStore.getState();

    toggleTask(READINESS_TASKS[0].id);
    const state = useAppStore.getState();
    expect(state.completedTasks).toContain(READINESS_TASKS[0].id);
    expect(state.readinessScore).toBeGreaterThan(0);
    expect(state.readinessScore).toBe(Math.round((1 / READINESS_TASKS.length) * 100));
  });

  it('updates the score correctly when a task is toggled off', () => {
    const { toggleTask } = useAppStore.getState();

    toggleTask(READINESS_TASKS[0].id);
    toggleTask(READINESS_TASKS[0].id);
    const state = useAppStore.getState();
    expect(state.completedTasks).not.toContain(READINESS_TASKS[0].id);
    expect(state.readinessScore).toBe(0);
  });

  it('reaches 100% readiness score when all tasks are completed', () => {
    const { toggleTask } = useAppStore.getState();

    READINESS_TASKS.forEach(task => toggleTask(task.id));
    const state = useAppStore.getState();
    expect(state.completedTasks.length).toBe(READINESS_TASKS.length);
    expect(state.readinessScore).toBe(100);
  });

  it('does not go below 0 or above 100', () => {
    const { toggleTask } = useAppStore.getState();

    READINESS_TASKS.forEach(task => toggleTask(task.id));
    READINESS_TASKS.forEach(task => toggleTask(task.id));
    const state = useAppStore.getState();
    expect(state.readinessScore).toBe(0);
    expect(state.completedTasks.length).toBe(0);
  });

  it('updates the language correctly', () => {
    const { setLanguage } = useAppStore.getState();
    setLanguage('hi');
    expect(useAppStore.getState().language).toBe('hi');
  });

  it('updates the selected state correctly', () => {
    const { setSelectedState } = useAppStore.getState();
    setSelectedState('Tamil Nadu');
    expect(useAppStore.getState().selectedState).toBe('Tamil Nadu');
  });

  it('adds messages to the store', () => {
    const { addMessage } = useAppStore.getState();
    const msg = { id: 'test-1', role: 'user' as const, content: 'Hello', timestamp: Date.now() };
    addMessage(msg);
    expect(useAppStore.getState().messages).toHaveLength(1);
    expect(useAppStore.getState().messages[0].content).toBe('Hello');
  });

  it('clears all messages', () => {
    const { addMessage, clearMessages } = useAppStore.getState();
    addMessage({ id: 'msg-1', role: 'user' as const, content: 'Test', timestamp: Date.now() });
    addMessage({ id: 'msg-2', role: 'assistant' as const, content: 'Reply', timestamp: Date.now() });
    clearMessages();
    expect(useAppStore.getState().messages).toHaveLength(0);
  });

  it('LANGUAGES array contains all 9 supported languages', () => {
    expect(LANGUAGES.length).toBe(9);
    const codes = LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
  });

  it('LANG_NAME maps codes to English names', () => {
    expect(LANG_NAME['en']).toBe('English');
    expect(LANG_NAME['hi']).toBe('Hindi');
    expect(LANG_NAME['ta']).toBe('Tamil');
  });

  it('READINESS_TASKS has 6 tasks with required fields', () => {
    expect(READINESS_TASKS.length).toBe(6);
    READINESS_TASKS.forEach(task => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('label');
      expect(task).toHaveProperty('icon');
    });
  });
});
