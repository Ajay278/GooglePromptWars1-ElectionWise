import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useAppStore } from '../store';
import { whatsappShare } from '../lib/utils';

const PHASES = [
  {
    id: 'sir', icon: '📋', label: 'Electoral Roll Revision (SIR)', status: 'completed',
    desc: 'Special Intensive Revision of voter rolls. BLOs visit every booth to verify registrations.',
    action: 'Check your name at voters.eci.gov.in', actionLink: 'https://voters.eci.gov.in',
    tip: 'If your name is missing, file Form 6 immediately during this phase.'
  },
  {
    id: 'mcc', icon: '📜', label: 'Model Code of Conduct', status: 'completed',
    desc: 'MCC announced on election schedule release. Political parties must follow conduct rules.',
    action: 'Report MCC violations using cVIGIL app', actionLink: '#',
    tip: 'Cash/gifts given in exchange for votes is illegal. Report via cVIGIL.'
  },
  {
    id: 'postal', icon: '📬', label: 'Postal Ballot Deadline', status: 'active',
    desc: 'Senior citizens (85+), PwD voters, and essential service workers can vote via postal ballot.',
    action: 'Apply using Form 12D via your District Election Office',
    tip: 'Deadline is typically 5 days before polling day. Check your State CEO website.'
  },
  {
    id: 'silent', icon: '🤫', label: 'Silent Period (48 Hours)', status: 'upcoming',
    desc: 'No campaigning, political speeches, or exit polls are allowed 48 hours before polling.',
    action: 'Plan your trip to the polling booth',
    tip: 'Use the Voter Helpline App to find your booth location before this period.'
  },
  {
    id: 'polling', icon: '🗳️', label: 'Polling Day', status: 'upcoming',
    desc: 'Exercise your franchise. Bring one valid photo ID. Booths open 7AM – 6PM typically.',
    action: 'Locate your booth at voters.eci.gov.in/PollingStation', actionLink: 'https://voters.eci.gov.in',
    tip: '12 alternative photo IDs are accepted if you don\'t have your EPIC card.'
  },
  {
    id: 'counting', icon: '📊', label: 'Counting Day', status: 'upcoming',
    desc: 'Votes are counted under observation of ECI officials. Results declared constituency-wise.',
    action: 'Watch results live at results.eci.gov.in', actionLink: 'https://results.eci.gov.in',
    tip: 'VVPAT slip count is done before EVM count for cross-verification.'
  },
];

const stateData: Record<string, { pollingDate: string; countingDate: string }> = {
  'Tamil Nadu': { pollingDate: 'April 23, 2026', countingDate: 'May 4, 2026' },
  'West Bengal': { pollingDate: 'Multi-phase: April–May 2026', countingDate: 'May 2026' },
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function Timeline() {
  const { selectedState } = useAppStore();
  const [active, setActive] = useState<string | null>(null);
  const dates = stateData[selectedState] || { pollingDate: 'Check eci.gov.in', countingDate: 'Check eci.gov.in' };

  const shareText = `📅 Election Timeline for ${selectedState}:\n🗳️ Polling: ${dates.pollingDate}\n📊 Counting: ${dates.countingDate}\n\nStay informed: ${window.location.origin}/timeline\n1950 Helpline | eci.gov.in`;

  return (
    <div className="min-h-full p-6 lg:p-8">
      <motion.div className="max-w-2xl mx-auto" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>

        <motion.div variants={fadeUp} className="mb-6">
          <p className="section-label">Election Roadmap</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>The Journey to the Polls</h1>
          <p className="text-white/50 text-sm mt-1">📍 {selectedState}</p>
        </motion.div>

        {/* Key dates */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8">
          {[['🗳️ Polling Day', dates.pollingDate], ['📊 Counting Day', dates.countingDate]].map(([label, date]) => (
            <div key={label as string} className="glass-card p-4 text-center">
              <p className="text-white/50 text-xs mb-1">{label}</p>
              <p className="text-[#C5A059] font-semibold text-sm">{date}</p>
            </div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-3">
            {PHASES.map((phase, i) => (
              <motion.div key={phase.id} variants={fadeUp} custom={i}>
                <button onClick={() => setActive(active === phase.id ? null : phase.id)}
                  className="w-full text-left">
                  <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200
                    ${active === phase.id ? 'bg-white/12 border-white/25' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                    {/* Node */}
                    <div className="relative z-10 shrink-0 mt-0.5">
                      {phase.status === 'completed' ? <CheckCircle2 size={24} className="text-[#C5A059]" />
                        : phase.status === 'active' ? <Clock size={24} className="text-blue-400 animate-pulse" />
                          : <Circle size={24} className="text-white/25" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{phase.icon}</span>
                        <p className="text-white font-semibold text-sm">{phase.label}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                          ${phase.status === 'completed' ? 'badge-gold' : phase.status === 'active' ? 'badge-blue' : 'text-white/30 border-white/15'}`}>
                          {phase.status === 'completed' ? 'Done' : phase.status === 'active' ? 'Now' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mt-1 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                </button>

                {active === phase.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="ml-10 mt-1 mb-2 p-4 rounded-xl bg-gradient-to-br from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[#C5A059] text-xs font-bold">WHAT TO DO:</span>
                      <p className="text-white/80 text-xs">{phase.action}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 text-xs font-bold">TIP:</span>
                      <p className="text-white/60 text-xs">{phase.tip}</p>
                    </div>
                    <button onClick={() => whatsappShare(`📅 ${phase.label}\n\n${phase.desc}\n\n✅ ${phase.action}\n💡 ${phase.tip}\n\nElectionWise | ${window.location.origin}`)}
                      className="btn-whatsapp text-xs py-1.5 px-3">
                      <Share2 size={12} /> Share on WhatsApp
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div variants={fadeUp} className="mt-6">
          <button onClick={() => whatsappShare(shareText)} className="btn-whatsapp w-full justify-center py-3">
            <Share2 size={16} /> Share Full Timeline on WhatsApp
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
