import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = { code: string; name: string; nativeName: string };

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export const LANG_NAME: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
  bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam'
};

export const READINESS_TASKS = [
  { id: 'eligibility', label: 'Checked my eligibility', icon: '✅' },
  { id: 'roll', label: 'Verified my name in voter roll', icon: '📋' },
  { id: 'booth', label: 'Located my polling booth', icon: '📍' },
  { id: 'id', label: 'Arranged valid photo ID', icon: '🪪' },
  { id: 'date', label: 'Know my polling date & time', icon: '📅' },
  { id: 'process', label: 'Understand the voting process', icon: '🗳️' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  completedTasks: string[];
  toggleTask: (id: string) => void;
  readinessScore: number;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      selectedState: 'All India',
      setSelectedState: (state) => set({ selectedState: state }),
      completedTasks: [],
      toggleTask: (id) => {
        const tasks = get().completedTasks;
        const updated = tasks.includes(id) ? tasks.filter(t => t !== id) : [...tasks, id];
        set({ completedTasks: updated, readinessScore: Math.round((updated.length / READINESS_TASKS.length) * 100) });
      },
      readinessScore: 0,
      messages: [],
      addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: 'electionwise-store', partialize: (s: AppState) => ({ language: s.language, selectedState: s.selectedState, completedTasks: s.completedTasks, readinessScore: s.readinessScore }) }
  )
);
