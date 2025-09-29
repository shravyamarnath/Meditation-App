// Web Worker for reliable background timer functionality
// This ensures timer continues even when browser tab is not active

interface TimerMessage {
  action: 'start' | 'pause' | 'stop' | 'reset';
  duration?: number;
}

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalDuration: number;
  startTime: number;
  pausedTime: number;
}

let timerState: TimerState = {
  isRunning: false,
  isPaused: false,
  timeRemaining: 0,
  totalDuration: 0,
  startTime: 0,
  pausedTime: 0
};

let intervalId: ReturnType<typeof setInterval> | null = null;

const updateTimer = () => {
  if (!timerState.isRunning || timerState.isPaused) return;

  const now = Date.now();
  const elapsed = (now - timerState.startTime - timerState.pausedTime) / 1000;
  timerState.timeRemaining = Math.max(0, timerState.totalDuration - elapsed);

  // Send update to main thread
  self.postMessage({
    type: 'tick',
    timeRemaining: Math.ceil(timerState.timeRemaining),
    isComplete: timerState.timeRemaining <= 0
  });

  // Stop timer if complete
  if (timerState.timeRemaining <= 0) {
    timerState.isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    self.postMessage({ type: 'complete' });
  }
};

self.onmessage = (e: MessageEvent<TimerMessage>) => {
  const { action, duration } = e.data;

  switch (action) {
    case 'start':
      if (duration) {
        // Fresh start
        timerState.totalDuration = duration;
        timerState.timeRemaining = duration;
        timerState.pausedTime = 0;
      }
      
      timerState.isRunning = true;
      timerState.isPaused = false;
      timerState.startTime = Date.now();
      
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(updateTimer, 100); // Update every 100ms for smooth UI
      
      self.postMessage({ type: 'started', timeRemaining: Math.ceil(timerState.timeRemaining) });
      break;

    case 'pause':
      if (timerState.isRunning && !timerState.isPaused) {
        timerState.isPaused = true;
        timerState.pausedTime += Date.now() - timerState.startTime;
        
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
      timerState.pausedTime = 0;
      
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

// Send initial state
self.postMessage({ type: 'ready' });

export {};