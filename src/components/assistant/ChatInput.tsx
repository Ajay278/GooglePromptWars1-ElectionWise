import { Mic, MicOff, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onSend: (text: string) => void;
  onToggleVoice: () => void;
}

export default function ChatInput({
  input,
  setInput,
  isLoading,
  isListening,
  onSend,
  onToggleVoice
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  return (
    <div className="shrink-0 px-4 py-4 border-t border-white/10 bg-white/5">
      <div className="flex gap-2 items-end max-w-2xl mx-auto">
        <textarea 
          value={input} 
          onChange={e => setInput(e.target.value)}
          aria-label="Type your message"
          onKeyDown={handleKeyDown}
          placeholder="Ask about elections, registration, booths, your rights..."
          rows={1} 
          className="flex-1 bg-white/10 border border-white/20 focus:border-[#C5A059]/50 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
          style={{ minHeight: 44, maxHeight: 120 }} 
        />
        <button 
          onClick={onToggleVoice} 
          aria-label="Use voice input"
          className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all", 
            isListening ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" : "bg-white/10 text-white/50 hover:bg-white/20"
          )}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <button 
          onClick={() => onSend(input)} 
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#D4B87A] flex items-center justify-center shrink-0 disabled:opacity-40 hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all"
        >
          <Send size={16} className="text-[#0A2342]" />
        </button>
      </div>
      <p className="text-white/20 text-[10px] text-center mt-2">Neutral civic information only • Grounded in ECI guidelines • Not political advice</p>
    </div>
  );
}
