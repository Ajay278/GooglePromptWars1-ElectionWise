import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Send, Bot, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store';
import { askAgent, generateId, cn } from '../lib/utils';

export default function Simulation() {
  const { language, selectedState } = useAppStore();
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const startGame = async () => {
    setMessages([]);
    setIsLoading(true);
    try {
      const reply = await askAgent(
        [{ role: 'user', content: 'Start the simulation. Give me my first scenario as an Election Officer.' }],
        language,
        selectedState,
        'simulation'
      );
      setMessages([{ id: generateId(), role: 'assistant', content: reply }]);
    } catch {
      setMessages([{ id: generateId(), role: 'assistant', content: 'Simulation unavailable.' }]);
    }
    setIsLoading(false);
  };

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const userMsg = { id: generateId(), role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await askAgent(history, language, selectedState, 'simulation');
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: 'Connection lost.' }]);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/40 to-emerald-500/40 border border-green-500/30 flex items-center justify-center">
            <Gamepad2 size={18} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Be the Election Officer</p>
            <p className="text-white/40 text-[11px]">Interactive Civic Simulation</p>
          </div>
        </div>
        <button onClick={startGame} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-colors">
          <RotateCcw size={12} /> Restart
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <Gamepad2 size={40} className="mx-auto text-emerald-400 mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">Polling Officer Simulator</h2>
            <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">Test your knowledge of ECI rules. You will be presented with real polling day scenarios (EVM issues, voter fraud, accessibility). Make the right call.</p>
            <button onClick={startGame} disabled={isLoading} className="px-6 py-3 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
              {isLoading ? 'Loading Scenario...' : 'Start Simulation'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                  <Bot size={13} className="text-emerald-400" />
                </div>
              )}
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 font-medium rounded-br-sm' : 'bg-white/10 border border-white/15 text-white/90 rounded-bl-sm'
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages.length > 0 && <div className="text-emerald-400 text-xs ml-9">Game Master is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      {messages.length > 0 && (
        <div className="shrink-0 px-4 py-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="What is your decision, Officer?"
              className="flex-1 bg-white/10 border border-white/20 focus:border-emerald-500/50 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
            <button onClick={sendMessage} disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-emerald-500/40 text-emerald-400 transition-all">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
