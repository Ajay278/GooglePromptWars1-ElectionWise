import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Share2, ChevronRight } from 'lucide-react';
import { whatsappShare } from '../lib/utils';

const STEPS = [
  { icon: '🚶', title: 'Arrive at Your Polling Booth', desc: 'Bring ONE valid photo ID. Arrive early. Booths open 7AM–6PM (check your state).', tip: 'Find booth at voters.eci.gov.in or your Voter Slip.' },
  { icon: '📋', title: 'Queue & Verification', desc: 'Join the correct queue (separate for men/women/PwD). Show EPIC or alternative ID to the Polling Officer.', tip: 'PwD voters get priority lane. Wheelchair assistance available.' },
  { icon: '✍️', title: 'Sign the Register (Form 17A)', desc: 'Polling Officer verifies your name and asks you to sign or leave thumb impression.', tip: 'You have the right to inspect Form 17A. Request it if needed.' },
  { icon: '💜', title: 'Indelible Ink Mark', desc: 'Your left index finger is marked with indelible ink to prevent duplicate voting.', tip: 'Already have ink from today? Report to Presiding Officer immediately.' },
  { icon: '🗳️', title: 'Cast Your Vote on EVM', desc: 'Enter booth alone. Press the blue button next to your chosen candidate on the EVM.', tip: 'Your vote is secret. No one can force your choice.' },
  { icon: '📄', title: 'Verify on VVPAT', desc: 'A paper slip showing candidate symbol appears in the VVPAT window for 7 seconds.', tip: 'This confirms your vote was recorded correctly before the slip drops into a sealed box.' },
];

const PWDINFO = [
  '♿ Wheelchair access & volunteers at all booths', '🏠 Home voting (postal ballot) for PwD & 85+ seniors',
  '🔊 Braille-enabled ballot papers available', '🚶 PwD voters may bring a companion into the booth',
  '📞 Call 1950 to pre-arrange accessibility services',
];

const fadeUp: Variants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function PollingDay() {
  const [active, setActive] = useState(0);
  return (
    <div className="min-h-full p-6 lg:p-8">
      <motion.div className="max-w-2xl mx-auto" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.07 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <p className="section-label">Step-by-Step Walkthrough</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>What Happens at the Polling Booth?</h1>
          <p className="text-white/50 text-sm mt-1">A complete guide for first-time voters</p>
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-2 mb-6">
          {STEPS.map((step, i) => (
            <div key={i}>
              <button onClick={() => setActive(active === i ? -1 : i)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${active === i ? 'bg-white/12 border-white/25' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold border transition-all ${i <= active ? 'bg-[#C5A059]/20 border-[#C5A059]/40 text-[#C5A059]' : 'bg-white/5 border-white/15 text-white/40'}`}>
                  {i < active ? '✓' : i + 1}
                </div>
                <p className="text-white font-semibold text-sm flex-1">{step.icon} {step.title}</p>
                <ChevronRight size={15} className={`text-white/30 transition-transform ${active === i ? 'rotate-90' : ''}`} />
              </button>
              {active === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="ml-11 mt-1 mb-2 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>
                  <div className="flex items-start gap-1.5 pt-1">
                    <span className="text-[#C5A059] text-xs font-bold shrink-0">💡 TIP:</span>
                    <p className="text-white/60 text-xs">{step.tip}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} className="gold-card p-5 mb-4">
          <p className="text-[#C5A059] font-bold text-sm mb-2">🔐 Is My Vote Safe? EVM & VVPAT Facts</p>
          <div className="space-y-1.5 text-sm text-white/70">
            {['EVMs are standalone — not connected to any network or internet.','VVPAT slip is physical proof your vote was recorded correctly.','EVMs are sealed and secured under CCTV until counting day.','Randomised EVM allocation prevents tampering. ECI observers present throughout.'].map(f => <p key={f}>• {f}</p>)}
          </div>
          <button onClick={() => whatsappShare(`🔐 EVM & VVPAT Facts (ECI Official):\n• EVMs not connected to internet\n• VVPAT provides physical vote verification\n• Strong rooms secured under CCTV\n• ECI observers present\n\nElectionWise | ${window.location.origin}`)}
            className="btn-whatsapp text-xs mt-3 py-1.5 px-3"><Share2 size={11} /> Share facts</button>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card p-5">
          <p className="text-white font-semibold text-sm mb-3">♿ Senior Citizens & PwD Services</p>
          <div className="space-y-1.5">{PWDINFO.map(i => <p key={i} className="text-white/70 text-sm">{i}</p>)}</div>
          <button onClick={() => whatsappShare(`♿ Special voting services for Seniors & PwD:\n\n${PWDINFO.join('\n')}\n\nElectionWise | ${window.location.origin}`)}
            className="btn-whatsapp text-xs mt-3 py-1.5 px-3"><Share2 size={11} /> Share with family</button>
        </motion.div>
      </motion.div>
    </div>
  );
}
