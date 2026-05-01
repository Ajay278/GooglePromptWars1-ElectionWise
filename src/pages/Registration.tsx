import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, FileCheck, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const registrationSteps = [
  {
    id: 'eligibility',
    title: 'Verify Eligibility',
    icon: User,
    description: 'Ensure you meet the basic requirements to participate in federal and local elections.',
    requirements: [
      'Must be a U.S. citizen',
      'Meet residency requirements',
      'Be at least 18 years old by Election Day',
      'Meet state requirements for voting'
    ]
  },
  {
    id: 'residency',
    title: 'Confirm Residency',
    icon: MapPin,
    description: 'Your voting location and ballot are determined by where you currently live.',
    requirements: [
      'Proof of residency document',
      'Current permanent address',
      'Local county verification',
      'Mailing address (if different)'
    ]
  },
  {
    id: 'documents',
    title: 'Prepare Documents',
    icon: FileCheck,
    description: 'Have your identification and state-required forms ready for submission.',
    requirements: [
      'Valid State ID or Driver License',
      'Social Security Number (last 4 digits)',
      'Birth Certificate (if required)',
      'Passport (if applicable)'
    ]
  }
];

export default function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStepComplete = (id: string) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const isAllComplete = completedSteps.length === registrationSteps.length;

  return (
    <div className="p-12 pb-24 max-w-5xl">
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/20">
          <ShieldCheck size={12} />
          Official Registration Guide
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Register to Vote</h2>
        <p className="text-lg text-white/50 font-medium max-w-2xl leading-relaxed">
          The foundation of your civic participation begins here. Follow our secure guide to prepare your registration.
        </p>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-4 mb-12">
        {registrationSteps.map((_, idx) => (
          <div 
            key={idx}
            className={cn(
              "h-2 flex-1 rounded-full transition-all duration-500",
              idx <= currentStep ? "bg-civic-gold" : "bg-white/5"
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Step Navigation */}
        <div className="col-span-4 space-y-4">
          {registrationSteps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isDone = completedSteps.includes(step.id);
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "w-full text-left p-6 rounded-3xl transition-all border group",
                  isActive 
                    ? "bg-white/10 border-white/10 shadow-xl" 
                    : "bg-transparent border-transparent hover:bg-white/5 text-white/40"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                    isActive ? "bg-civic-gold text-primary-900" : "bg-white/5 text-white/40 group-hover:text-white"
                  )}>
                    {isDone ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight">{step.title}</h4>
                    <p className="text-[10px] font-bold opacity-40">Phase {idx + 1}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10 min-h-[500px] flex flex-col"
            >
              <div className="flex-1">
                <div className="bg-primary-800 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                  {(() => {
                    const Icon = registrationSteps[currentStep].icon;
                    return <Icon size={32} className="text-civic-gold" />;
                  })()}
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                  {registrationSteps[currentStep].title}
                </h3>
                <p className="text-white/50 font-medium leading-relaxed mb-10 max-w-lg">
                  {registrationSteps[currentStep].description}
                </p>

                <div className="space-y-4 mb-12">
                  {registrationSteps[currentStep].requirements.map((req, rIdx) => (
                    <div 
                      key={rIdx} 
                      className="flex items-center gap-4 bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-default"
                    >
                      <div className="w-2 h-2 rounded-full bg-civic-gold" />
                      <span className="text-sm font-bold text-white/90">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="btn-outline flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                
                {currentStep < registrationSteps.length - 1 ? (
                  <button 
                    onClick={() => setCurrentStep(prev => Math.min(registrationSteps.length - 1, prev + 1))}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next Phase <ChevronRight size={20} />
                  </button>
                ) : (
                  <button className="btn-primary bg-emerald-500 shadow-emerald-500/20 flex items-center gap-2">
                    Proceed to Official Site <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 bg-civic-blue/30 p-6 rounded-3xl border border-white/5 flex items-start gap-4">
            <Info className="text-civic-gold shrink-0 mt-1" size={20} />
            <div>
              <h5 className="text-sm font-bold text-white mb-1">State Verification</h5>
              <p className="text-xs text-white/40 leading-relaxed font-medium">
                FlowOS ElectionWise provides guidance for federal registration standards. Always verify specific local requirements with your Secretary of State's office.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
