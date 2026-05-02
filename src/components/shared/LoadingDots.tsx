import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function LoadingDots() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
        <Bot size={13} className="text-indigo-400" />
      </div>
      <div className="bg-white/10 border border-white/15 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
        {[0, 1, 2].map(i => (
          <span 
            key={i} 
            className="w-2 h-2 bg-white/40 rounded-full animate-bounce" 
            style={{ animationDelay: `${i * 0.15}s` }} 
          />
        ))}
      </div>
    </motion.div>
  );
}
