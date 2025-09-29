import { useState, useEffect } from 'react';
import TimerDisplay from '@/components/TimerDisplay';
import BreathingGuide from '@/components/BreathingGuide';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { type Preset } from '@/components/MeditationPreset';

interface TimerProps {
  selectedPreset: Preset | null;
  onBackToPresets: () => void;
}

export default function Timer({ selectedPreset, onBackToPresets }: TimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showInterface, setShowInterface] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  const duration = selectedPreset ? selectedPreset.duration * 60 : 600; // Convert minutes to seconds

  useEffect(() => {
    setTimeRemaining(duration);
    setSessionComplete(false);
  }, [duration, selectedPreset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setSessionComplete(true);
            console.log('Session completed!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining]);

  useEffect(() => {
    if (isActive && !isPaused) {
      const timer = setTimeout(() => {
        setShowInterface(false);
      }, 5000); // Hide interface after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setSessionComplete(false);
    console.log('Timer started for:', selectedPreset?.name);
  };

  const handlePause = () => {
    setIsPaused(true);
    setShowInterface(true);
    console.log('Timer paused');
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(duration);
    setShowInterface(true);
    setSessionComplete(false);
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

  if (sessionComplete) {
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
              onClick={handleStop}
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
        isActive && !isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
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
        isActive && !isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
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
            isActive={isActive && !isPaused}
            onCycleComplete={handleCycleComplete}
          />
          
          {/* Timer controls for breathing exercises */}
          <div className={`mt-8 flex gap-4 transition-opacity duration-500 ${
            isActive && !isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
          }`}>
            {!isActive || isPaused ? (
              <Button
                onClick={handleStart}
                data-testid="button-start-breathing"
              >
                {isPaused ? 'Resume' : 'Start'} Practice
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
            
            {(isActive || isPaused) && (
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
            isActive && !isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="text-sm text-muted-foreground">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
            </div>
          </div>
        </div>
      ) : (
        <TimerDisplay
          duration={duration}
          isActive={isActive}
          isPaused={isPaused}
          timeRemaining={timeRemaining}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          showInterface={showInterface}
        />
      )}
      
      {/* Click to show interface during active session */}
      {isActive && !isPaused && !showInterface && (
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