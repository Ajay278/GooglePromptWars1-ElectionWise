import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  msg: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function ChatMessage({ msg }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
    >
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
  );
}
