import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Share2, Trash2, Globe, Mic, MicOff, Volume2 } from 'lucide-react';
import { useAppStore, LANGUAGES } from '../store';
import { askAgent, generateId, whatsappShare, cn } from '../lib/utils';
import { logAnalyticsEvent } from '../lib/analytics';



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

  // Memoised suggestion list — never recreated between renders
  const SUGGESTIONS = useMemo(() => RAW_SUGGESTIONS, []);


  // Stop speaking when unmounted
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

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

      // Fire-and-forget analytics — never blocks UX
      logAnalyticsEvent('ai_query', { mode: 'assistant', language });

      // Text to speech for accessibility
      if ('speechSynthesis' in window && isAutoSpeakEnabled) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(reply.replace(/Fact Confidence Score:.*?$/m, '')); // Don't read the score tag
        // Simple language matching
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

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = { 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN', 'en': 'en-IN' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.continuous = false;

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
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border border-indigo-500/30 flex items-center justify-center">
            <Bot size={18} className="text-indigo-300" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm flex items-center gap-1.5">Civic Assistant <Sparkles size={12} className="text-[#C5A059]" /></p>
            <p className="text-white/40 text-[11px]">Powered by Vertex AI • Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language quick-switch */}
          <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1">
            <Globe size={12} className="text-white/40" />
            <select value={language} onChange={e => setLanguage(e.target.value)}
              aria-label="Select AI response language"
              className="bg-transparent text-white/70 text-xs outline-none cursor-pointer">
              {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-[#0A2342]">{l.nativeName}</option>)}
            </select>
          </div>
          <button onClick={() => setIsAutoSpeakEnabled(!isAutoSpeakEnabled)} 
            aria-label={isAutoSpeakEnabled ? "Disable auto-speak" : "Enable auto-speak"}
            className={cn("p-1.5 rounded-lg transition-all", isAutoSpeakEnabled ? "text-[#C5A059] bg-[#C5A059]/10" : "text-white/30 hover:bg-white/10")}>
            <Volume2 size={15} className={cn(isSpeaking && "animate-pulse")} />
          </button>
          {isSpeaking && (
            <button onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }} className="p-1.5 text-red-400 bg-red-400/10 rounded-lg">
              <MicOff size={15} />
            </button>
          )}
          {messages.length > 0 && (
            <button onClick={clearMessages} aria-label="Clear chat history" className="p-1.5 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10">
              <Trash2 size={15} />
            </button>
          )}
          {lastAssistantMsg && (
            <button onClick={() => whatsappShare(`ElectionWise Civic Guide:\n\n${lastAssistantMsg.content}\n\nFor more: ${window.location.origin}`)}
              aria-label="Share last response on WhatsApp"
              className="p-1.5 text-white/30 hover:text-green-400 transition-colors rounded-lg hover:bg-white/10">
              <Share2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Bot size={28} className="text-indigo-400" />
              </div>
              <h2 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Ask ElectionWise</h2>
              <p className="text-white/40 text-sm max-w-sm mx-auto">Your neutral, ECI-grounded election guide. Ask anything about the Indian election process.</p>
            </div>
            <p className="text-[#C5A059] text-xs font-bold tracking-widest uppercase text-center">Common Questions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-left text-sm text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <Bot size={13} className="text-indigo-400" />
                </div>
              )}
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#C5A059] to-[#D4B87A] text-[#0A2342] font-medium rounded-br-sm'
                  : 'bg-white/10 border border-white/15 text-white/90 rounded-bl-sm whitespace-pre-wrap'
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot size={13} className="text-indigo-400" />
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2 items-end max-w-2xl mx-auto">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            aria-label="Type your message"
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask about elections, registration, booths, your rights..."
            rows={1} className="flex-1 bg-white/10 border border-white/20 focus:border-[#C5A059]/50 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
            style={{ minHeight: 44, maxHeight: 120 }} />
          <button onClick={toggleVoiceInput} aria-label="Use voice input"
            className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all", 
              isListening ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" : "bg-white/10 text-white/50 hover:bg-white/20"
            )}>
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#D4B87A] flex items-center justify-center shrink-0 disabled:opacity-40 hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all">
            <Send size={16} className="text-[#0A2342]" />
          </button>
        </div>
        <p className="text-white/20 text-[10px] text-center mt-2">Neutral civic information only • Grounded in ECI guidelines • Not political advice</p>
      </div>
    </div>
  );
}
