import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, CalendarDays, BookOpen, MapPin, AlertTriangle, Vote, Gamepad2, ShieldAlert } from 'lucide-react';
import { useAppStore, LANGUAGES } from '../store';
import { INDIAN_STATES, cn } from '../lib/utils';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const navItems = [
  { path: '/', icon: Home, label: 'Overview' },
  { path: '/assistant', icon: MessageSquare, label: 'Civic Assistant' },
  { path: '/timeline', icon: CalendarDays, label: 'Election Timeline' },
  { path: '/voter-guide', icon: BookOpen, label: 'Voter Guide' },
  { path: '/polling-day', icon: MapPin, label: 'Polling Day' },
  { path: '/report', icon: AlertTriangle, label: 'Report & Rights' },
  { path: '/simulation', icon: Gamepad2, label: 'Officer Simulation' },
  { path: '/detector', icon: ShieldAlert, label: 'Fake News Detector' },
];

export default function Sidebar() {
  const { language, setLanguage, selectedState, setSelectedState } = useAppStore();

  const { translated } = useAutoTranslate([
    'Overview', 'Civic Assistant', 'Election Timeline', 'Voter Guide', 
    'Polling Day', 'Report & Rights', 'Officer Simulation', 'Fake News Detector',
    'Your State', 'Language', 'Navigate'
  ]);

  const localizedNavItems = [
    { ...navItems[0], label: translated[0] },
    { ...navItems[1], label: translated[1] },
    { ...navItems[2], label: translated[2] },
    { ...navItems[3], label: translated[3] },
    { ...navItems[4], label: translated[4] },
    { ...navItems[5], label: translated[5] },
    { ...navItems[6], label: translated[6] },
    { ...navItems[7], label: translated[7] },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-white/10 bg-white/5 backdrop-blur-sm shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#D4B87A] flex items-center justify-center shadow-lg shadow-[#C5A059]/30">
            <Vote size={18} className="text-[#0A2342]" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>ElectionWise</h1>
            <p className="text-white/40 text-[10px]">Civic Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* State Selector */}
      <div className="px-4 pt-4">
        <p className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase mb-1.5">{translated[8]}</p>
        <select
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          aria-label="Select your Indian state"
          className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-[#C5A059]/50 cursor-pointer"
        >
          {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-[#0A2342]">{s}</option>)}
        </select>
      </div>

      {/* Language */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase mb-1.5">{translated[9]}</p>
        <div className="flex flex-wrap gap-1">
          {LANGUAGES.slice(0, 5).map(l => (
            <button key={l.code} onClick={() => setLanguage(l.code)}
              aria-label={`Change language to ${l.name}`}
              className={cn('text-[11px] px-2 py-1 rounded-lg transition-all font-medium',
                language === l.code ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40' : 'text-white/50 hover:text-white hover:bg-white/10'
              )}>
              {l.nativeName}
            </button>
          ))}
          {LANGUAGES.slice(5).map(l => (
            <button key={l.code} onClick={() => setLanguage(l.code)}
              aria-label={`Change language to ${l.name}`}
              className={cn('text-[11px] px-2 py-1 rounded-lg transition-all font-medium',
                language === l.code ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40' : 'text-white/50 hover:text-white hover:bg-white/10'
              )}>
              {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="text-[#C5A059] text-[10px] font-bold tracking-widest uppercase px-1 mb-2">{translated[10]}</p>
        {localizedNavItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/'}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
              isActive ? 'bg-white/15 text-white border border-white/20' : 'text-white/60 hover:text-white hover:bg-white/10'
            )}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/30 text-[10px] text-center">Grounded in ECI Guidelines</p>
        <p className="text-[#C5A059]/60 text-[10px] text-center font-semibold">eci.gov.in • 1950 Helpline</p>
      </div>
    </aside>
  );
}
