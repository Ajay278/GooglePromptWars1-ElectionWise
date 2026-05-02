import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

/**
 * Lazy-loaded page components.
 * Each page is code-split into its own chunk so the initial bundle only
 * includes the shell (Sidebar + BottomNav). Subsequent navigations load
 * the target page chunk on demand, reducing First Contentful Paint.
 */
const Home       = lazy(() => import('./pages/Home'));
const Assistant  = lazy(() => import('./pages/Assistant'));
const Timeline   = lazy(() => import('./pages/Timeline'));
const VoterGuide = lazy(() => import('./pages/VoterGuide'));
const PollingDay = lazy(() => import('./pages/PollingDay'));
const ReportRights = lazy(() => import('./pages/ReportRights'));
const Simulation = lazy(() => import('./pages/Simulation'));
const Detector   = lazy(() => import('./pages/Detector'));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

/** Minimal skeleton shown while a lazy page chunk is being fetched. */
function PageSkeleton() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full">
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/"           element={<Home />} />
            <Route path="/assistant"  element={<Assistant />} />
            <Route path="/timeline"   element={<Timeline />} />
            <Route path="/voter-guide" element={<VoterGuide />} />
            <Route path="/polling-day" element={<PollingDay />} />
            <Route path="/report"     element={<ReportRights />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/detector"   element={<Detector />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatedRoutes />
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}
