import { useState, useEffect } from 'react';
import ProgressStats from '@/components/ProgressStats';
import { sessionManager, type SessionStats } from '@/lib/sessionManager';

export default function Progress() {
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisWeek: 0,
    favoriteType: 'None',
    lastSession: 'Never'
  });

  useEffect(() => {
    // Load real session stats
    const loadStats = async () => {
      const sessionStats = await sessionManager.getSessionStats();
      setStats(sessionStats);
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-thin text-foreground mb-4">Your Journey</h1>
          <p className="text-muted-foreground text-lg">Track your meditation progress and celebrate your commitment</p>
        </div>
        
        <ProgressStats stats={stats} />
        
        {/* Motivational message */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Keep Going</h3>
            <p className="text-muted-foreground">
              Consistency is more important than duration. Even a few minutes of daily practice 
              can create lasting positive changes in your mind and well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}