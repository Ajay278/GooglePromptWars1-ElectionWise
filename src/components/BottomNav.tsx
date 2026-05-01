import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, CalendarDays, BookOpen, MapPin, Gamepad2, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const items = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/assistant', icon: MessageSquare, label: 'Ask AI' },
  { path: '/voter-guide', icon: BookOpen, label: 'Guide' },
  { path: '/polling-day', icon: MapPin, label: 'Polling' },
  { path: '/simulation', icon: Gamepad2, label: 'Sim' },
  { path: '/detector', icon: ShieldAlert, label: 'Fact' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A2342]/95 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/'}
            className={({ isActive }) => cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0',
              isActive ? 'text-[#C5A059]' : 'text-white/40'
            )}>
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
