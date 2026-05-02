import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useAppStore } from '../store';
import { askAgent, generateId, whatsappShare } from '../lib/utils';
import { logAnalyticsEvent } from '../lib/analytics';

// Sub-components
import ChatHeader from '../components/assistant/ChatHeader';
import ChatMessage from '../components/assistant/ChatMessage';
import ChatInput from '../components/assistant/ChatInput';
import Suggestions from '../components/assistant/Suggestions';

const RAW_SUGGESTIONS = [
  "My name isn't on the voter list. What do I do?",
  "I'm a senior citizen and can't travel. Can I still vote?",
  "What ID documents can I bring to the polling booth?",
  "Someone is giving cash near the booth. How do I report it?",
  "My status says 'Under Adjudication'. What does that mean?",
  "How do I register as a first-time voter?",
];

export default function Assistant() {
  const { messages, addMessage, clearMessages, language, setLanguage, selectedState } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(false);

  const SUGGESTIONS = useMemo(() => RAW_SUGGESTIONS, []);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = { id: generateId(), role: 'user' as const, content: text.trim(), timestamp: Date.now() };
    addMessage(userMsg);
    setInput('');
    setIsLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await askAgent(history, language, selectedState, 'assistant');
      addMessage({ id: generateId(), role: 'assistant', content: reply, timestamp: Date.now() });

      logAnalyticsEvent('ai_query', { mode: 'assistant', language });

      if ('speechSynthesis' in window && isAutoSpeakEnabled) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply.replace(/Fact Confidence Score:.*?$/m, ''));
        const langMap: Record<string, string> = { 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN', 'en': 'en-IN' };
        utterance.lang = langMap[language] || 'en-IN';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      addMessage({ id: generateId(), role: 'assistant', content: '⚠️ Unable to connect. Please try again or call the 1950 helpline.', timestamp: Date.now() });
    }
    setIsLoading(false);
  }, [isLoading, messages, language, selectedState, addMessage, isAutoSpeakEnabled]);

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Voice input is not supported in this browser.');
    if (isListening) { setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = { 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN', 'en': 'en-IN' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [isListening, language, sendMessage]);

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ChatHeader 
        language={language}
        setLanguage={setLanguage}
        isAutoSpeakEnabled={isAutoSpeakEnabled}
        setIsAutoSpeakEnabled={setIsAutoSpeakEnabled}
        isSpeaking={isSpeaking}
        onStopSpeaking={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }}
        onClear={clearMessages}
        onShare={() => lastAssistantMsg && whatsappShare(`ElectionWise Civic Guide:\n\n${lastAssistantMsg.content}\n\nFor more: ${window.location.origin}`)}
        hasMessages={messages.length > 0}
        showShare={!!lastAssistantMsg}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <Suggestions suggestions={SUGGESTIONS} onSelect={sendMessage} />
        )}

        <AnimatePresence>
          {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot size={13} className="text-indigo-400" />
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput 
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isListening={isListening}
        onSend={sendMessage}
        onToggleVoice={toggleVoiceInput}
      />
    </div>
  );
}
