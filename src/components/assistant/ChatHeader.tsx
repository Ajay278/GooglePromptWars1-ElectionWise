import { Bot, Sparkles, Globe, Volume2, MicOff, Trash2, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LANGUAGES } from '../../store';

interface ChatHeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  isAutoSpeakEnabled: boolean;
  setIsAutoSpeakEnabled: (val: boolean) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onClear: () => void;
  onShare: () => void;
  hasMessages: boolean;
  showShare: boolean;
}

export default function ChatHeader({
  language,
  setLanguage,
  isAutoSpeakEnabled,
  setIsAutoSpeakEnabled,
  isSpeaking,
  onStopSpeaking,
  onClear,
  onShare,
  hasMessages,
  showShare
}: ChatHeaderProps) {
  return (
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
        <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1">
          <Globe size={12} className="text-white/40" />
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            aria-label="Select AI response language"
            className="bg-transparent text-white/70 text-xs outline-none cursor-pointer"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="bg-[#0A2342]">{l.nativeName}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setIsAutoSpeakEnabled(!isAutoSpeakEnabled)} 
          aria-label={isAutoSpeakEnabled ? "Disable auto-speak" : "Enable auto-speak"}
          className={cn("p-1.5 rounded-lg transition-all", isAutoSpeakEnabled ? "text-[#C5A059] bg-[#C5A059]/10" : "text-white/30 hover:bg-white/10")}
        >
          <Volume2 size={15} className={cn(isSpeaking && "animate-pulse")} />
        </button>
        {isSpeaking && (
          <button onClick={onStopSpeaking} className="p-1.5 text-red-400 bg-red-400/10 rounded-lg">
            <MicOff size={15} />
          </button>
        )}
        {hasMessages && (
          <button onClick={onClear} aria-label="Clear chat history" className="p-1.5 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10">
            <Trash2 size={15} />
          </button>
        )}
        {showShare && (
          <button onClick={onShare} aria-label="Share last response on WhatsApp" className="p-1.5 text-white/30 hover:text-green-400 transition-colors rounded-lg hover:bg-white/10">
            <Share2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
