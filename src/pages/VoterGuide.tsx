import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Share2, ChevronDown } from 'lucide-react';
import { whatsappShare, cn } from '../lib/utils';

const FORMS = [
  { id: 'new', title: 'New Voter Registration', form: 'Form 6', icon: '🆕', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', trigger: "I'm a first-time voter or just turned 18", steps: ['Go to voters.eci.gov.in', 'Click "Apply Online" → Form 6', 'Fill your name, DOB, address (as per Aadhaar)', 'Upload photo + proof of age + proof of address', 'Submit and note your Reference ID', 'Track status on the portal or call 1950'] },
  { id: 'correction', title: 'Correct My Voter Details', form: 'Form 8', icon: '✏️', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', trigger: 'My name spelling, DOB, or address is wrong', steps: ['Visit voters.eci.gov.in → Form 8', 'Select the field(s) to correct', 'Upload supporting documents (Aadhaar, DL, etc.)', 'Submit and keep reference number', 'BLO will verify your details within 30 days'] },
  { id: 'move', title: 'I Moved Addresses', form: 'Form 8A / Form 6', icon: '🏠', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30', trigger: 'I moved to a new area or city', steps: ['Same constituency? Use Form 8A (transposition)', 'Different constituency? Delete old (Form 7) + add new (Form 6)', 'Both forms available at voters.eci.gov.in', 'Provide new address proof (utility bill, Aadhaar, rent agreement)'] },
  { id: 'adjudication', title: 'Under Adjudication Status', form: 'Contact BLO', icon: '⚠️', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', trigger: "My voter roll status says 'Under Adjudication'", steps: ['This means your entry was flagged during SIR for document verification', 'Do NOT panic — you can resolve this', 'Visit your local Booth Level Officer (BLO) in person', 'Bring original Aadhaar + any 2 supporting documents', 'BLO will verify and clear your status', 'Call 1950 to find your BLO\'s contact details'] },
];

const VALID_IDS = [
  '🪪 Aadhaar Card', '🛂 Passport', '🚗 Driving Licence', '💳 PAN Card',
  '📋 MNREGS Job Card', '🏦 Bank/Post Office Passbook with Photo',
  '👴 Pension Document with Photo', '🏛️ Central/State Govt Photo ID',
  '🏥 Health Insurance Smart Card (Ayushman Bharat)',
  '🎓 Student Photo ID Card', '📘 NPR Smart Card', '🧾 GST Certificate with Photo'
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function VoterGuide() {
  const [open, setOpen] = useState<string | null>('new');
  const [showIDs, setShowIDs] = useState(false);

  return (
    <div className="min-h-full p-6 lg:p-8">
      <motion.div className="max-w-2xl mx-auto" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.07 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <p className="section-label">Registration & Eligibility</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Voter Guide</h1>
          <p className="text-white/50 text-sm mt-1">ECI-grounded, step-by-step registration help</p>
        </motion.div>

        {/* Eligibility */}
        <motion.div variants={fadeUp} className="gold-card p-4 mb-6">
          <p className="text-[#C5A059] font-bold text-sm mb-2">✅ Basic Eligibility (India)</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
            {['Age 18+ on Jan 1 of election year', 'Indian citizen', 'Ordinary resident of the constituency', 'Not disqualified by law'].map(e => (
              <div key={e} className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span><span>{e}</span></div>
            ))}
          </div>
        </motion.div>

        {/* Forms */}
        <motion.div variants={fadeUp} className="space-y-3 mb-6">
          <p className="section-label">Find Your Form</p>
          {FORMS.map(form => (
            <div key={form.id} className={`rounded-2xl border bg-gradient-to-r ${form.color} ${form.border} overflow-hidden`}>
              <button onClick={() => setOpen(open === form.id ? null : form.id)}
                className="w-full flex items-center gap-3 p-4 text-left">
                <span className="text-xl">{form.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{form.title}</p>
                  <p className="text-white/50 text-xs italic">"{form.trigger}"</p>
                </div>
                <span className="badge-gold text-[10px]">{form.form}</span>
                <ChevronDown size={16} className={cn('text-white/40 transition-transform', open === form.id && 'rotate-180')} />
              </button>
              {open === form.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 space-y-3">
                  <div className="space-y-1.5">
                    {form.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="w-5 h-5 rounded-full bg-white/15 text-white/60 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        <span className="text-white/80">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap pt-1">
                    <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer"
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                      <ExternalLink size={11} /> voters.eci.gov.in
                    </a>
                    <button onClick={() => whatsappShare(`📋 ${form.title} (${form.form})\n\nSteps:\n${form.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nElectionWise | ${window.location.origin}`)}
                      className="btn-whatsapp text-xs py-1.5 px-3">
                      <Share2 size={11} /> Share
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Valid IDs */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <button onClick={() => setShowIDs(!showIDs)} className="w-full flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">🪪 12 Valid Photo IDs for Voting</p>
              <p className="text-white/40 text-xs">Any ONE is sufficient if you don't have EPIC</p>
            </div>
            <ChevronDown size={16} className={cn('text-white/40 transition-transform', showIDs && 'rotate-180')} />
          </button>
          {showIDs && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {VALID_IDS.map(id => (
                <div key={id} className="text-white/70 text-sm bg-white/5 rounded-xl px-3 py-2">{id}</div>
              ))}
              <div className="col-span-full mt-2">
                <button onClick={() => whatsappShare(`🪪 12 Valid IDs accepted at Indian polling booths:\n\n${VALID_IDS.join('\n')}\n\nAny ONE is sufficient! Source: ECI\nElectionWise | ${window.location.origin}`)}
                  className="btn-whatsapp text-xs py-1.5 px-3 w-full justify-center">
                  <Share2 size={11} /> Share this list on WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
