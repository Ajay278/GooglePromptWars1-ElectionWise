import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import { useAppStore } from '../store';
import { askAgent, cn } from '../lib/utils';

export default function Detector() {
  const { language, selectedState } = useAppStore();
  const [claim, setClaim] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ verdict: 'True' | 'False' | 'Misleading' | 'Error'; explanation: string } | null>(null);

  const analyzeClaim = async () => {
    if (!claim.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const reply = await askAgent([{ role: 'user', content: claim }], language, selectedState, 'detector');
      
      // Parse the response "VERDICT: [result]\nEXPLANATION: [text]"
      const verdictMatch = reply.match(/VERDICT:\s*(True|False|Misleading)/i);
      const explanationMatch = reply.split(/EXPLANATION:/i);
      
      if (verdictMatch && explanationMatch.length > 1) {
        const vStr = verdictMatch[1].toLowerCase();
        setResult({
          verdict: vStr === 'true' ? 'True' : vStr === 'false' ? 'False' : 'Misleading',
          explanation: explanationMatch[1].trim()
        });
      } else {
        setResult({ verdict: 'Error', explanation: 'Could not parse the AI response. Raw output: ' + reply });
      }
    } catch {
      setResult({ verdict: 'Error', explanation: 'Failed to connect to the Fact-Checking API.' });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full max-h-screen px-4 py-6 sm:px-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-widest uppercase mb-4">
          <ShieldAlert size={14} /> AI Misinformation Detector
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Verify Election Claims</h1>
        <p className="text-white/60 text-sm">Paste a WhatsApp forward, rumor, or news headline below. Our AI cross-references the claim with official ECI guidelines.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
        <textarea
          value={claim}
          onChange={e => setClaim(e.target.value)}
          placeholder="e.g. 'You can vote online this year using the Aadhaar app!'"
          className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-lg min-h-[120px]"
        />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
          <p className="text-white/30 text-xs">AI fact-checking is experimental.</p>
          <button 
            onClick={analyzeClaim} 
            disabled={!claim.trim() || isAnalyzing}
            className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            {isAnalyzing ? <span className="animate-pulse">Analyzing...</span> : <><Search size={16} /> Analyze Claim</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className={cn(
              "rounded-2xl p-6 border",
              result.verdict === 'True' && "bg-green-500/10 border-green-500/30",
              result.verdict === 'False' && "bg-red-500/10 border-red-500/30",
              result.verdict === 'Misleading' && "bg-yellow-500/10 border-yellow-500/30",
              result.verdict === 'Error' && "bg-white/5 border-white/10"
            )}>
              <div className="flex items-center gap-3 mb-4">
                {result.verdict === 'True' && <CheckCircle className="text-green-400" size={28} />}
                {result.verdict === 'False' && <XCircle className="text-red-400" size={28} />}
                {result.verdict === 'Misleading' && <AlertTriangle className="text-yellow-400" size={28} />}
                {result.verdict === 'Error' && <ShieldAlert className="text-white/40" size={28} />}
                
                <h3 className={cn(
                  "text-2xl font-bold uppercase tracking-wide",
                  result.verdict === 'True' && "text-green-400",
                  result.verdict === 'False' && "text-red-400",
                  result.verdict === 'Misleading' && "text-yellow-400",
                  result.verdict === 'Error' && "text-white/60"
                )}>
                  {result.verdict}
                </h3>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                {result.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
