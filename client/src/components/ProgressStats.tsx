import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, Target, Calendar } from 'lucide-react';

interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  favoriteType: string;
  lastSession: string;
}

interface ProgressStatsProps {
  stats: SessionStats;
}

export default function ProgressStats({ stats }: ProgressStatsProps) {
  const achievements = [
    { name: 'First Steps', description: 'Complete your first session', unlocked: stats.totalSessions >= 1 },
    { name: 'Consistent', description: '7-day streak', unlocked: stats.currentStreak >= 7 },
    { name: 'Dedicated', description: '100 total minutes', unlocked: stats.totalMinutes >= 100 },
    { name: 'Mindful Master', description: '50 sessions completed', unlocked: stats.totalSessions >= 50 }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-thin text-foreground" data-testid="text-total-minutes">
              {stats.totalMinutes}
            </div>
            <div className="text-xs text-muted-foreground">Total Minutes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-thin text-foreground" data-testid="text-total-sessions">
              {stats.totalSessions}
            </div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-thin text-foreground" data-testid="text-current-streak">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-thin text-foreground" data-testid="text-this-week">
              {stats.thisWeek}
            </div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Session</span>
            <span className="text-sm text-foreground" data-testid="text-last-session">{stats.lastSession}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Favorite Practice</span>
            <Badge variant="secondary" data-testid="badge-favorite-type">{stats.favoriteType}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Longest Streak</span>
            <span className="text-sm text-foreground flex items-center gap-1" data-testid="text-longest-streak">
              <Flame className="h-3 w-3 text-primary" />
              {stats.longestStreak} days
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border transition-all ${
                  achievement.unlocked 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-muted'
                }`}
                data-testid={`achievement-${index}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-xs font-medium ${
                    achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}