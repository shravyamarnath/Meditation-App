import ProgressStats from '@/components/ProgressStats';

export default function Progress() {
  // todo: remove mock functionality - this will be replaced with real data from backend
  const mockStats = {
    totalSessions: 23,
    totalMinutes: 345,
    currentStreak: 5,
    longestStreak: 12,
    thisWeek: 4,
    favoriteType: 'Box Breathing',
    lastSession: '2 hours ago'
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-thin text-foreground mb-4">Your Journey</h1>
          <p className="text-muted-foreground text-lg">Track your meditation progress and celebrate your commitment</p>
        </div>
        
        <ProgressStats stats={mockStats} />
        
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