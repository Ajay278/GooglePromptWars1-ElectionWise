import { useAppStore, READINESS_TASKS } from '../store';

interface Props { size?: number }

export default function ReadinessScore({ size = 120 }: Props) {
  const { readinessScore, completedTasks, toggleTask } = useAppStore();
  const radius = (size / 2) - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (readinessScore / 100) * circumference;

  const color = readinessScore >= 80 ? '#2D6A4F' : readinessScore >= 50 ? '#C5A059' : '#C1121F';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{readinessScore}%</span>
          <span className="text-[10px] text-white/50">Ready</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full space-y-2">
        {READINESS_TASKS.map(task => {
          const done = completedTasks.includes(task.id);
          return (
            <button key={task.id} onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left text-sm
                ${done ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
              <span className="text-base">{task.icon}</span>
              <span className="flex-1">{task.label}</span>
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0
                ${done ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                {done && '✓'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
