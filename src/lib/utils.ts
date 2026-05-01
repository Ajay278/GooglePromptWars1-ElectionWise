import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins class names together, specifically tailored for Tailwind CSS.
 * @param inputs - Array of class values to merge
 * @returns Merged string of Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sends a message to the Vertex AI agent on the backend
 * @param messages - Chat history payload
 * @param language - The preferred language code for the response
 * @param selectedState - The user's selected Indian state context
 * @param mode - The persona mode ('assistant', 'simulation', 'detector')
 * @returns Promise resolving to the AI's response string
 */
export async function askAgent(messages: { role: string; content: string }[], language: string, selectedState: string, mode: 'assistant' | 'simulation' | 'detector' = 'assistant') {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, language: LANG_NAME[language] || 'English', selectedState, mode })
  });
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();
  return data.reply as string;
}

/**
 * Translates an array of text strings using the Google Cloud Translation API.
 * @param texts - Array of strings to translate
 * @param targetLang - Target ISO language code (e.g., 'hi' for Hindi)
 * @returns Promise resolving to an array of translated strings
 */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en') return texts;
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texts, targetLanguage: targetLang })
  });
  if (!res.ok) return texts;
  const data = await res.json();
  return data.translations || texts;
}

const LANG_NAME: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
  bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam'
};

export const INDIAN_STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

/**
 * Opens a new window with a pre-filled WhatsApp share link.
 * @param text - The text to share on WhatsApp
 */
export function whatsappShare(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Generates a short, random alphanumeric ID.
 * @returns A 7-character random string
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Formats a Date object into an Indian date string format (e.g., "23 April 2026").
 * @param date - The Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
