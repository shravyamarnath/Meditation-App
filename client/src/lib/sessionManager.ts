import { type Preset } from '@/components/MeditationPreset';
import { type MeditationSettings } from '@/components/SettingsPanel';

export interface MeditationSession {
  id: string;
  presetId: string;
  presetName: string;
  presetType: 'breathing' | 'meditation';
  duration: number; // in minutes
  completedAt: Date;
  completionPercentage: number; // 0-100
  wasCompleted: boolean;
}

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  favoriteType: string;
  lastSession: string;
}

class SessionManager {
  private readonly SESSIONS_KEY = 'meditation_sessions';
  private readonly SETTINGS_KEY = 'meditation_settings';
  private readonly LAST_SESSION_DATE_KEY = 'last_session_date';

  // Session Management
  startSession(preset: Preset): string {
    const sessionId = this.generateSessionId();
    const session: Partial<MeditationSession> = {
      id: sessionId,
      presetId: preset.id,
      presetName: preset.name,
      presetType: preset.type,
      duration: preset.duration,
      completionPercentage: 0,
      wasCompleted: false
    };
    
    // Store active session
    localStorage.setItem('active_session', JSON.stringify(session));
    console.log('Started session:', sessionId, preset.name);
    
    return sessionId;
  }

  completeSession(sessionId: string, completionPercentage: number = 100): void {
    const activeSession = this.getActiveSession();
    if (!activeSession || activeSession.id !== sessionId) {
      console.warn('No matching active session found');
      return;
    }

    const completedSession: MeditationSession = {
      ...activeSession,
      completedAt: new Date(),
      completionPercentage,
      wasCompleted: completionPercentage >= 90 // Consider 90%+ as completed
    } as MeditationSession;

    // Save to history
    this.saveSessionToHistory(completedSession);
    
    // Update last session date for streak tracking
    localStorage.setItem(this.LAST_SESSION_DATE_KEY, new Date().toISOString());
    
    // Clear active session
    localStorage.removeItem('active_session');
    
    console.log('Completed session:', sessionId, `${completionPercentage}%`);
  }

  getActiveSession(): Partial<MeditationSession> | null {
    const stored = localStorage.getItem('active_session');
    return stored ? JSON.parse(stored) : null;
  }

  // Session History
  private saveSessionToHistory(session: MeditationSession): void {
    const sessions = this.getAllSessions();
    sessions.unshift(session); // Add to beginning
    
    // Keep only last 100 sessions
    const trimmed = sessions.slice(0, 100);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(trimmed));
  }

  getAllSessions(): MeditationSession[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (!stored) return [];
    
    try {
      const sessions = JSON.parse(stored);
      // Convert date strings back to Date objects
      return sessions.map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt)
      }));
    } catch {
      return [];
    }
  }

  getRecentSessions(limit: number = 10): MeditationSession[] {
    return this.getAllSessions().slice(0, limit);
  }

  // Statistics
  getSessionStats(): SessionStats {
    const sessions = this.getAllSessions();
    const completedSessions = sessions.filter(s => s.wasCompleted);
    
    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        thisWeek: 0,
        favoriteType: 'None',
        lastSession: 'Never'
      };
    }

    const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const currentStreak = this.calculateCurrentStreak(completedSessions);
    const longestStreak = this.calculateLongestStreak(completedSessions);
    const thisWeek = this.getThisWeekSessions(completedSessions);
    const favoriteType = this.getFavoriteType(completedSessions);
    const lastSession = this.getLastSessionText(completedSessions[0]);

    return {
      totalSessions: completedSessions.length,
      totalMinutes,
      currentStreak,
      longestStreak,
      thisWeek,
      favoriteType,
      lastSession
    };
  }

  private calculateCurrentStreak(sessions: MeditationSession[]): number {
    if (sessions.length === 0) return 0;

    const today = new Date();
    const dates = this.getUniqueDates(sessions);
    let streak = 0;
    
    for (let i = 0; i < dates.length; i++) {
      const daysDiff = this.getDaysDifference(dates[i], today);
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private calculateLongestStreak(sessions: MeditationSession[]): number {
    if (sessions.length === 0) return 0;
    
    const dates = this.getUniqueDates(sessions);
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = this.getDaysDifference(dates[i], dates[i - 1]);
      
      if (daysDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  }

  private getThisWeekSessions(sessions: MeditationSession[]): number {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    return sessions.filter(s => s.completedAt >= weekStart).length;
  }

  private getFavoriteType(sessions: MeditationSession[]): string {
    const typeCounts: Record<string, number> = {};
    
    sessions.forEach(s => {
      typeCounts[s.presetName] = (typeCounts[s.presetName] || 0) + 1;
    });
    
    let maxCount = 0;
    let favoriteType = 'None';
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteType = type;
      }
    });
    
    return favoriteType;
  }

  private getLastSessionText(session?: MeditationSession): string {
    if (!session) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - session.completedAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return session.completedAt.toLocaleDateString();
  }

  private getUniqueDates(sessions: MeditationSession[]): Date[] {
    const dateStrings = new Set<string>();
    
    sessions.forEach(s => {
      const dateStr = s.completedAt.toDateString();
      dateStrings.add(dateStr);
    });
    
    return Array.from(dateStrings)
      .map(str => new Date(str))
      .sort((a, b) => b.getTime() - a.getTime()); // Most recent first
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Settings Management
  saveSettings(settings: MeditationSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved');
  }

  getSettings(): MeditationSettings {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (!stored) {
      // Return default settings
      return {
        intervalBells: false,
        intervalDuration: 5,
        soundEnabled: true,
        bellSound: 'tibetan',
        volume: 50,
        visualCues: true,
        autoFadeInterface: true,
        fadeDuration: 10
      };
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      console.warn('Failed to parse stored settings, using defaults');
      // Return default settings directly instead of recursive call
      return {
        intervalBells: false,
        intervalDuration: 5,
        soundEnabled: true,
        bellSound: 'tibetan',
        volume: 50,
        visualCues: true,
        autoFadeInterface: true,
        fadeDuration: 10
      };
    }
  }

  // Utility
  clearAllData(): void {
    localStorage.removeItem(this.SESSIONS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    localStorage.removeItem(this.LAST_SESSION_DATE_KEY);
    localStorage.removeItem('active_session');
    console.log('All meditation data cleared');
  }
}

export const sessionManager = new SessionManager();