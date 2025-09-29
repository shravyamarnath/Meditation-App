import ProgressStats from '../ProgressStats';

export default function ProgressStatsExample() {
  // todo: remove mock functionality
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-thin text-foreground mb-4">Your Progress</h1>
          <p className="text-muted-foreground">Track your meditation journey</p>
        </div>
        
        <ProgressStats stats={mockStats} />
      </div>
    </div>
  );
}