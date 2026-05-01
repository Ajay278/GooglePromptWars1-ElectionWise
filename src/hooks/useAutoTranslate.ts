import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { translateTexts } from '../lib/utils';

/**
 * Hook to automatically translate a set of static strings when the app language changes.
 * @param originalTexts - The base strings (in English) to be translated.
 * @returns An array of translated strings.
 */
export function useAutoTranslate(originalTexts: string[]) {
  const { language } = useAppStore();
  const [translated, setTranslated] = useState<string[]>(originalTexts);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language === 'en') {
      setTranslated(originalTexts);
      return;
    }

    let isMounted = true;
    const performTranslation = async () => {
      setIsTranslating(true);
      try {
        const results = await translateTexts(originalTexts, language);
        if (isMounted) setTranslated(results);
      } catch (err) {
        console.error('Translation hook error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    performTranslation();
    return () => { isMounted = false; };
  }, [language, JSON.stringify(originalTexts)]); // Use stringified array to avoid reference-based re-triggers

  return { translated, isTranslating };
}
