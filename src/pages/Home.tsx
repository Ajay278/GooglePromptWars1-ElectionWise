import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, CalendarDays, BookOpen, MapPin, AlertTriangle, Share2, Phone } from 'lucide-react';
import { useAppStore } from '../store';
import ReadinessScore from '../components/ReadinessScore';
import { whatsappShare } from '../lib/utils';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const modules = [
  { path: '/assistant', icon: MessageSquare, label: 'Civic Assistant', desc: 'Ask anything about elections in your language', color: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/30' },
  { path: '/timeline', icon: CalendarDays, label: 'Election Timeline', desc: 'Dates, deadlines & what to do now', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { path: '/voter-guide', icon: BookOpen, label: 'Voter Guide', desc: 'Registration, forms & eligibility', color: 'from-[#C5A059]/20 to-amber-500/20', border: 'border-[#C5A059]/30' },
  { path: '/polling-day', icon: MapPin, label: 'Polling Day Guide', desc: 'Step-by-step booth walkthrough', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { path: '/report', icon: AlertTriangle, label: 'Report & Rights', desc: 'cVIGIL, 1950 helpline & your rights', color: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30' },
];

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function Home() {
  const { selectedState, readinessScore, language } = useAppStore();

  const { translated } = useAutoTranslate([
    'Your Vote. Your Voice. 🗳️',
    'A trusted civic guide grounded in official ECI guidelines. Navigate the election process in your language, step by step.',
    'Civic Assistant', 'Ask anything about elections in your language',
    'Election Timeline', 'Dates, deadlines & what to do now',
    'Voter Guide', 'Registration, forms & eligibility',
    'Polling Day Guide', 'Step-by-step booth walkthrough',
    'Report & Rights', 'cVIGIL, 1950 helpline & your rights',
    "I'm preparing to vote! Check your voter readiness at ElectionWise",
    'Share with your family', 'Forward this guide on WhatsApp. Every vote counts.'
  ]);

  const shareText = `${translated[11]} — ${window.location.origin}\nHelpline: 1950 | Portal: voters.eci.gov.in`;

  const localizedModules = [
    { ...modules[0], label: translated[2], desc: translated[3] },
    { ...modules[1], label: translated[4], desc: translated[5] },
    { ...modules[2], label: translated[6], desc: translated[7] },
    { ...modules[3], label: translated[8], desc: translated[9] },
    { ...modules[4], label: translated[10], desc: translated[11] },
  ];

  return (
    <div className="min-h-full p-6 lg:p-8">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-8">

        {/* Hero */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C5A059]/20 to-indigo-500/10 border border-[#C5A059]/20 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <p className="text-[#C5A059] text-xs font-bold tracking-widest uppercase mb-1">Election Commission of India</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {translated[0]}
          </h1>
          <p className="text-white/60 text-sm max-w-lg">
            {translated[1]}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="badge-gold">📍 {selectedState}</span>
            <span className="badge-green">✅ ECI Verified</span>
            <a href="tel:1950" className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/20 transition-all">
              <Phone size={12} /> 1950 Helpline
            </a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <motion.div variants={fadeUp} className="lg:col-span-1 glass-card p-6">
            <p className="section-label mb-4">Voter Readiness</p>
            <ReadinessScore size={110} />
            {readinessScore === 100 && (
              <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center">
                <p className="text-emerald-300 font-semibold text-sm">🎉 You are election ready!</p>
              </div>
            )}
          </motion.div>

          {/* Quick Modules */}
          <motion.div variants={fadeUp} className="lg:col-span-2 space-y-3">
            <p className="section-label">Explore</p>
            {localizedModules.map(({ path, icon: Icon, label, desc, color, border }) => (
              <Link key={path} to={path}
                className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${color} ${border} backdrop-blur-sm hover:scale-[1.01] transition-all duration-200 group`}>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-white/50 text-xs truncate">{desc}</p>
                </div>
                <span className="text-white/30 ml-auto">›</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* WhatsApp Share */}
        <motion.div variants={fadeUp} className="glass-card p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">📢 {translated[12]}</p>
            <p className="text-white/50 text-xs mt-0.5">{translated[13]}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => whatsappShare(shareText)} className="btn-whatsapp text-sm">
              <Share2 size={15} /> WhatsApp
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={fadeUp} className="text-center text-white/25 text-xs pb-4">
          ElectionWise is an independent civic guide. All information is grounded in official ECI guidelines.
          For authoritative information, visit <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-white/50">eci.gov.in</a>
        </motion.div>

      </motion.div>
    </div>
  );
}
