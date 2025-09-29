import { useState, useEffect } from 'react';

interface BreathingGuideProps {
  pattern: 'box' | '4-7-8' | 'equal';
  isActive: boolean;
  onCycleComplete?: () => void;
}

const patterns = {
  box: {
    name: 'Box Breathing',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in slowly' },
      { name: 'Hold', duration: 4000, instruction: 'Hold your breath' },
      { name: 'Exhale', duration: 4000, instruction: 'Breathe out slowly' },
      { name: 'Hold', duration: 4000, instruction: 'Hold empty' }
    ]
  },
  '4-7-8': {
    name: '4-7-8 Breathing',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in through nose' },
      { name: 'Hold', duration: 7000, instruction: 'Hold your breath' },
      { name: 'Exhale', duration: 8000, instruction: 'Exhale through mouth' }
    ]
  },
  equal: {
    name: 'Equal Breathing',
    phases: [
      { name: 'Inhale', duration: 4000, instruction: 'Breathe in' },
      { name: 'Exhale', duration: 4000, instruction: 'Breathe out' }
    ]
  }
};

export default function BreathingGuide({ pattern, isActive, onCycleComplete }: BreathingGuideProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const currentPattern = patterns[pattern];
  const phase = currentPattern.phases[currentPhase];
  const isInhale = phase.name === 'Inhale';
  const isExhale = phase.name === 'Exhale';

  useEffect(() => {
    if (!isActive) {
      setCurrentPhase(0);
      setProgress(0);
      setCycleCount(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (phase.duration / 50);
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          const nextPhase = (currentPhase + 1) % currentPattern.phases.length;
          setCurrentPhase(nextPhase);
          
          if (nextPhase === 0) {
            setCycleCount(prev => {
              const newCount = prev + 1;
              onCycleComplete?.();
              return newCount;
            });
          }
          
          return 0;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, phase.duration, currentPattern.phases.length, onCycleComplete]);

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-48 h-48 rounded-full border-2 border-muted flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-lg font-medium text-foreground mb-2">{currentPattern.name}</div>
            <div className="text-sm text-muted-foreground">Ready to begin</div>
          </div>
        </div>
      </div>
    );
  }

  const circleScale = isInhale ? 1 + (progress / 200) : isExhale ? 1 - (progress / 200) : 1;
  const circleOpacity = 0.3 + (progress / 100) * 0.4;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Breathing Circle */}
      <div className="relative mb-8">
        <div 
          className="w-48 h-48 rounded-full border-2 border-primary/30 flex items-center justify-center transition-all duration-200 ease-out"
          style={{
            transform: `scale(${circleScale})`,
            backgroundColor: `hsl(var(--primary) / ${circleOpacity})`
          }}
        >
          <div className="text-center">
            <div className="text-xl font-medium text-primary-foreground mb-1" data-testid="text-phase-name">
              {phase.name}
            </div>
            <div className="text-sm text-primary-foreground/80" data-testid="text-phase-instruction">
              {phase.instruction}
            </div>
          </div>
        </div>
        
        {/* Progress ring */}
        <svg
          className="absolute inset-0 transform -rotate-90"
          width="192"
          height="192"
          viewBox="0 0 192 192"
        >
          <circle
            cx="96"
            cy="96"
            r="94"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary"
            strokeDasharray={`${(progress / 100) * 590} 590`}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Cycle Counter */}
      <div className="text-center">
        <div className="text-lg text-foreground mb-1" data-testid="text-cycle-count">
          Cycle {cycleCount + 1}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentPattern.name}
        </div>
      </div>
    </div>
  );
}