import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface SuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function Suggestions({ suggestions, onSelect }: SuggestionsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
          <Bot size={28} className="text-indigo-400" />
        </div>
        <h2 className="text-white font-bold text-lg mb-1 font-playfair">Ask ElectionWise</h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto">Your neutral, ECI-grounded election guide. Ask anything about the Indian election process.</p>
      </div>
      <p className="text-[#C5A059] text-xs font-bold tracking-widest uppercase text-center">Common Questions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
        {suggestions.map(s => (
          <button 
            key={s} 
            onClick={() => onSelect(s)}
            className="text-left text-sm text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
