import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Timeline from './pages/Timeline';
import VoterGuide from './pages/VoterGuide';
import PollingDay from './pages/PollingDay';
import ReportRights from './pages/ReportRights';
import Simulation from './pages/Simulation';
import Detector from './pages/Detector';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/voter-guide" element={<VoterGuide />} />
          <Route path="/polling-day" element={<PollingDay />} />
          <Route path="/report" element={<ReportRights />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/detector" element={<Detector />} />
        </Routes>
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
