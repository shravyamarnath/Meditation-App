import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onTick?: (timeRemaining: number) => void;
}

interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  isComplete: boolean;
}

export function useTimer({ duration, onComplete, onTick }: UseTimerProps) {
  const [state, setState] = useState<TimerState>({
    timeRemaining: duration,
    isActive: false,
    isPaused: false,
    isComplete: false
  });

  const workerRef = useRef<Worker | null>(null);
  const currentDuration = useRef(duration);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  // Update duration when prop changes
  useEffect(() => {
    if (currentDuration.current !== duration) {
      currentDuration.current = duration;
      if (!state.isActive) {
        setState(prev => ({ ...prev, timeRemaining: duration, isComplete: false }));
      }
    }
  }, [duration, state.isActive]);

  // Initialize Web Worker - no dependencies to prevent recreation
  useEffect(() => {
    // Create worker from inline script to avoid external file issues
    const workerScript = `
      let timerState = {
        isRunning: false,
        isPaused: false,
        timeRemaining: 0,
        totalDuration: 0,
        startTime: 0,
        accumulatedElapsed: 0,
        endTime: 0
      };
      
      let intervalId = null;
      
      const updateTimer = () => {
        if (!timerState.isRunning || timerState.isPaused) return;
      
        const now = Date.now();
        const elapsed = (timerState.accumulatedElapsed + (now - timerState.startTime)) / 1000;
        timerState.timeRemaining = Math.max(0, timerState.totalDuration - elapsed);
      
        self.postMessage({
          type: 'tick',
          timeRemaining: Math.ceil(timerState.timeRemaining),
          isComplete: timerState.timeRemaining <= 0
        });
      
        if (timerState.timeRemaining <= 0) {
          timerState.isRunning = false;
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          self.postMessage({ type: 'complete' });
        }
      };
      
      self.onmessage = (e) => {
        const { action, duration } = e.data;
      
        switch (action) {
          case 'start':
            const now = Date.now();
            
            if (duration) {
              // Fresh start
              timerState.totalDuration = duration;
              timerState.timeRemaining = duration;
              timerState.accumulatedElapsed = 0;
              timerState.endTime = now + (duration * 1000);
            } else {
              // Resume from pause
              const remainingMs = timerState.timeRemaining * 1000;
              timerState.endTime = now + remainingMs;
            }
            
            timerState.isRunning = true;
            timerState.isPaused = false;
            timerState.startTime = now;
            
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(updateTimer, 100);
            
            self.postMessage({ type: 'started', timeRemaining: Math.ceil(timerState.timeRemaining) });
            break;
      
          case 'pause':
            if (timerState.isRunning && !timerState.isPaused) {
              timerState.isPaused = true;
              timerState.accumulatedElapsed += Date.now() - timerState.startTime;
              
              if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
              }
              
              self.postMessage({ type: 'paused', timeRemaining: Math.ceil(timerState.timeRemaining) });
            }
            break;
      
          case 'stop':
          case 'reset':
            timerState.isRunning = false;
            timerState.isPaused = false;
            timerState.timeRemaining = timerState.totalDuration;
            timerState.accumulatedElapsed = 0;
            
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            
            self.postMessage({ 
              type: 'stopped', 
              timeRemaining: Math.ceil(timerState.timeRemaining) 
            });
            break;
        }
      };
      
      self.postMessage({ type: 'ready' });
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    worker.onmessage = (e) => {
      const { type, timeRemaining, isComplete } = e.data;
      
      switch (type) {
        case 'ready':
          console.log('Timer worker ready');
          break;
          
        case 'started':
          setState(prev => ({ 
            ...prev, 
            isActive: true, 
            isPaused: false, 
            timeRemaining,
            isComplete: false
          }));
          break;
          
        case 'paused':
          setState(prev => ({ ...prev, isPaused: true, timeRemaining }));
          break;
          
        case 'stopped':
          setState(prev => ({ 
            ...prev, 
            isActive: false, 
            isPaused: false, 
            timeRemaining,
            isComplete: false
          }));
          break;
          
        case 'tick':
          setState(prev => ({ ...prev, timeRemaining, isComplete }));
          onTickRef.current?.(timeRemaining);
          break;
          
        case 'complete':
          setState(prev => ({ 
            ...prev, 
            isActive: false, 
            isPaused: false,
            isComplete: true,
            timeRemaining: 0
          }));
          onCompleteRef.current?.();
          break;
      }
    };
    
    workerRef.current = worker;
    
    return () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []); // Empty deps to prevent worker recreation

  const start = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ 
        action: 'start', 
        duration: state.isPaused ? undefined : currentDuration.current 
      });
    }
  }, [state.isPaused]);

  const pause = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'pause' });
    }
  }, []);

  const stop = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'stop' });
    }
  }, []);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: 'reset' });
    }
  }, []);

  return {
    ...state,
    start,
    pause,
    stop,
    reset,
    progress: currentDuration.current > 0 ? 
      ((currentDuration.current - state.timeRemaining) / currentDuration.current) * 100 : 0
  };
}