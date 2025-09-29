import { useState } from 'react';
import TimerDisplay from '../TimerDisplay';

export default function TimerDisplayExample() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [showInterface, setShowInterface] = useState(true);
  const duration = 600;

  const handleStart = () => {
    console.log('Timer started');
    setIsActive(true);
    setIsPaused(false);
    // Simulate timer countdown
    setTimeout(() => setTimeRemaining(580), 1000);
  };

  const handlePause = () => {
    console.log('Timer paused');
    setIsPaused(true);
  };

  const handleStop = () => {
    console.log('Timer stopped');
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(duration);
  };

  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
}