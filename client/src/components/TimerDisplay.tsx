import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface TimerDisplayProps {
  duration: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  showInterface: boolean;
}

export default function TimerDisplay({
  duration,
  isActive,
  isPaused,
  timeRemaining,
  onStart,
  onPause,
  onStop,
  showInterface
}: TimerDisplayProps) {
  const progress = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Timer Circle */}
      <div className="relative mb-12">
        <svg
          className="transform -rotate-90"
          width="280"
          height="280"
          viewBox="0 0 280 280"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-primary transition-all duration-300 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-thin text-foreground mb-2" data-testid="text-time-remaining">
              {formatTime(timeRemaining)}
            </div>
            {isActive && !isPaused && (
              <div className="text-sm text-muted-foreground animate-pulse">
                meditation in progress
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls - fade out during active session */}
      <div className={`flex gap-4 transition-opacity duration-500 ${
        isActive && !isPaused && !showInterface ? 'opacity-0' : 'opacity-100'
      }`}>
        {!isActive || isPaused ? (
          <Button
            size="icon"
            variant="default"
            onClick={onStart}
            className="h-12 w-12"
            data-testid="button-start"
          >
            <Play className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="secondary"
            onClick={onPause}
            className="h-12 w-12"
            data-testid="button-pause"
          >
            <Pause className="h-6 w-6" />
          </Button>
        )}
        
        {(isActive || isPaused) && (
          <Button
            size="icon"
            variant="outline"
            onClick={onStop}
            className="h-12 w-12"
            data-testid="button-stop"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}