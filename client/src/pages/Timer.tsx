import { useState, useEffect } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import BreathingGuide from '@/components/BreathingGuide';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { type Preset } from '@/components/MeditationPreset';
import { useTimer } from '@/hooks/useTimer';
import { sessionManager } from '@/lib/sessionManager';

interface TimerProps {
  selectedPreset: Preset | null;
  onBackToPresets: () => void;
}

export default function Timer({ selectedPreset, onBackToPresets }: TimerProps) {
  const [showInterface, setShowInterface] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const duration = selectedPreset ? selectedPreset.duration * 60 : 600; // Convert minutes to seconds

  const timer = useTimer({
    duration,
    onComplete: async () => {
      console.log('Session completed!');
      if (sessionId && selectedPreset) {
        const completionPercentage = 100;
        await sessionManager.completeSession(sessionId, completionPercentage);
      }
    },
    onTick: (timeRemaining) => {
      // Optional: Log progress or update UI
    }
  });

  useEffect(() => {
    if (timer.isActive && !timer.isPaused) {
      const fadeTimer = setTimeout(() => {
        setShowInterface(false);
      }, 5000); // Hide interface after 5 seconds
      
      return () => clearTimeout(fadeTimer);
    }
  }, [timer.isActive, timer.isPaused]);

  const handleStart = async () => {
    if (selectedPreset && !sessionId) {
      const newSessionId = await sessionManager.startSession(selectedPreset);
      setSessionId(newSessionId);
    }
    timer.start();
    console.log('Timer started for:', selectedPreset?.name);
  };

  const handlePause = () => {
    timer.pause();
    setShowInterface(true);
    console.log('Timer paused');
  };

  const handleStop = async () => {
    timer.stop();
    setShowInterface(true);
    
    // Save partial session if there was progress
    if (sessionId && selectedPreset && timer.progress > 0) {
      const completionPercentage = Math.round(timer.progress);
      await sessionManager.completeSession(sessionId, completionPercentage);
    }
    
    setSessionId(null);
    console.log('Timer stopped');
  };

  const handleCycleComplete = () => {
    console.log('Breathing cycle completed');
  };

  if (!selectedPreset) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-4">No Preset Selected</h2>
          <p className="text-muted-foreground mb-8">Please select a meditation preset to begin</p>
          <Button onClick={onBackToPresets} data-testid="button-back-to-presets">
            Choose Preset
          </Button>
        </div>
      </div>
    );
  }

  if (timer.isComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl">🧘</div>
            </div>
            <h2 className="text-2xl font-thin text-foreground mb-4">Session Complete</h2>
            <p className="text-muted-foreground mb-2">Well done! You've completed your {selectedPreset.name} session.</p>
            <p className="text-sm text-muted-foreground">{selectedPreset.duration} minutes of mindfulness</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => {
                timer.reset();
                setSessionId(null);
              }}
              data-testid="button-restart-session"
            >
              Practice Again
            </Button>
            <Button 
              variant="outline" 
              onClick={onBackToPresets}
              data-testid="button-choose-new-preset"
            >
              Choose Different Practice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isBreathingExercise = selectedPreset.type === 'breathing';

  return (
    <div className="min-h-screen relative">
      {/* Back button */}
      <div className={`absolute top-4 left-4 z-10 transition-opacity duration-500 ${
        timer.isActive && !timer.isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
      }`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToPresets}
          className="gap-2"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Session title */}
      <div className={`absolute top-4 right-4 z-10 transition-opacity duration-500 ${
        timer.isActive && !timer.isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{selectedPreset.name}</div>
          <div className="text-xs text-muted-foreground">{selectedPreset.duration} minutes</div>
        </div>
      </div>

      {/* Main content */}
      {isBreathingExercise ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <BreathingGuide
            pattern={selectedPreset.technique as 'box' | '4-7-8' | 'equal'}
            isActive={timer.isActive && !timer.isPaused}
            onCycleComplete={handleCycleComplete}
          />
          
          {/* Timer controls for breathing exercises */}
          <div className={`mt-8 flex gap-4 transition-opacity duration-500 ${
            timer.isActive && !timer.isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
          }`}>
            {!timer.isActive || timer.isPaused ? (
              <Button
                onClick={handleStart}
                data-testid="button-start-breathing"
              >
                {timer.isPaused ? 'Resume' : 'Start'} Practice
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handlePause}
                data-testid="button-pause-breathing"
              >
                Pause
              </Button>
            )}
            
            {(timer.isActive || timer.isPaused) && (
              <Button
                variant="outline"
                onClick={handleStop}
                data-testid="button-stop-breathing"
              >
                Stop
              </Button>
            )}
          </div>
          
          {/* Time remaining for breathing exercises */}
          <div className={`mt-4 text-center transition-opacity duration-500 ${
            timer.isActive && !timer.isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="text-sm text-muted-foreground">
              {Math.floor(timer.timeRemaining / 60)}:{(timer.timeRemaining % 60).toString().padStart(2, '0')} remaining
            </div>
          </div>
        </div>
      ) : (
        <TimerDisplay
          duration={duration}
          isActive={timer.isActive}
          isPaused={timer.isPaused}
          timeRemaining={timer.timeRemaining}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          showInterface={showInterface}
        />
      )}
      
      {/* Click to show interface during active session */}
      {timer.isActive && !timer.isPaused && !showInterface && (
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={() => {
            setShowInterface(true);
            setTimeout(() => setShowInterface(false), 3000);
          }}
          data-testid="overlay-show-interface"
        />
      )}
    </div>
  );
}