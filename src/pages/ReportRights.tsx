import { motion } from 'framer-motion';
import { Phone, ExternalLink, Share2 } from 'lucide-react';
import { whatsappShare } from '../lib/utils';

const RIGHTS = [
  { icon: '🗳️', title: 'Right to Secret Ballot', desc: 'No one — not your employer, family member, or any party worker — can force or witness your vote.' },
  { icon: '📋', title: 'Right to Inspect Form 17A', desc: 'You can request the Presiding Officer to show the electoral register to verify your entry.' },
  { icon: '❌', title: 'Right to Refuse Vote (NOTA)', desc: 'You may press NOTA (None of the Above) if you do not wish to vote for any candidate.' },
  { icon: '🚫', title: 'Right to Report Violations', desc: 'Any voter can report code violations, booth capturing, or inducements via cVIGIL or calling 1950.' },
  { icon: '♿', title: 'Right to Assistance (PwD)', desc: 'PwD voters may bring a companion of their choice into the voting booth for assistance.' },
];

const CVIGIL = [
  'Open the cVIGIL app (Android/iOS)',
  'Take a photo or short video of the violation',
  'The app auto-captures location — no need to type address',
  'Submit — an ECI flying squad is dispatched within 100 minutes',
  'Track status within the app anonymously',
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function ReportRights() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <motion.div className="max-w-2xl mx-auto" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.07 } } }}>

        <motion.div variants={fadeUp} className="mb-6">
          <p className="section-label">Report Violations & Know Your Rights</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Report & Rights</h1>
          <p className="text-white/50 text-sm mt-1">Your voice matters. Know how to protect it.</p>
        </motion.div>

        {/* 1950 Helpline */}
        <motion.div variants={fadeUp} className="gold-card p-5 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/20 flex items-center justify-center shrink-0">
            <Phone size={22} className="text-[#C5A059]" />
          </div>
          <div className="flex-1">
            <p className="text-[#C5A059] font-bold text-lg">1950</p>
            <p className="text-white/70 text-sm">National Voter Helpline — Toll Free, 8AM–8PM</p>
            <p className="text-white/40 text-xs">Registration queries, booth location, grievances</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="tel:1950" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              <Phone size={11} /> Call Now
            </a>
            <button onClick={() => whatsappShare('📞 ECI Voter Helpline: 1950 (Toll-free)\n🌐 voters.eci.gov.in\n\nFor registration, booth location & grievances.\n\nElectionWise | ' + window.location.origin)}
              className="btn-whatsapp text-xs py-1.5 px-3"><Share2 size={11} /> Share</button>
          </div>
        </motion.div>

        {/* cVIGIL */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📸</span>
            <div>
              <p className="text-white font-semibold text-sm">cVIGIL App — Report Violations Instantly</p>
              <p className="text-white/40 text-xs">ECI's official real-time violation reporting tool</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {CVIGIL.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                <span className="text-white/70">{step}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href="https://play.google.com/store/apps/details?id=in.nic.eci.cvigil" target="_blank" rel="noreferrer"
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              <ExternalLink size={11} /> Get cVIGIL (Android)
            </a>
            <button onClick={() => whatsappShare(`📸 See an election violation? Use the cVIGIL app!\n\nHow to use:\n${CVIGIL.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nDownload: play.google.com search "cVIGIL"\nElectionWise | ${window.location.origin}`)}
              className="btn-whatsapp text-xs py-1.5 px-3"><Share2 size={11} /> Share Guide</button>
          </div>
        </motion.div>

        {/* Voter Rights */}
        <motion.div variants={fadeUp} className="space-y-2 mb-4">
          <p className="section-label">Your Voter Rights</p>
          {RIGHTS.map(r => (
            <div key={r.title} className="glass-card p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">{r.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{r.title}</p>
                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* NGSP */}
        <motion.div variants={fadeUp} className="glass-card p-4">
          <p className="text-white font-semibold text-sm mb-2">📝 National Grievance Portal (NGSP 2.0)</p>
          <p className="text-white/60 text-xs mb-3">File formal complaints about election processes. Resolved within 48 hours typically.</p>
          <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="btn-ghost text-xs flex items-center gap-1.5 w-fit">
            <ExternalLink size={11} /> eci.gov.in/ngsp
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
