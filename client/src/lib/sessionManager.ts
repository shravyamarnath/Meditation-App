import { type Preset } from '@/components/MeditationPreset';
import type { Session, UserSettings, SessionStats, InsertSession, InsertUserSettings } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export interface MeditationSession extends Session {}

export interface MeditationSettings {
  intervalBells: boolean;
  intervalDuration: number;
  soundEnabled: boolean;
  bellSound: string;
  volume: number;
  visualCues: boolean;
  autoFadeInterface: boolean;
  fadeDuration: number;
}

export { type SessionStats };

class SessionManager {
  private currentUserId: string | null = null; // For future auth integration
  private activeSessionId: string | null = null;
  private anonymousUserId: string | null = null;

  constructor() {
    // Generate or retrieve anonymous user ID for session isolation
    this.initializeAnonymousUser();
  }

  private initializeAnonymousUser(): void {
    const stored = localStorage.getItem('meditation_anonymous_user_id');
    if (stored) {
      this.anonymousUserId = stored;
    } else {
      this.anonymousUserId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('meditation_anonymous_user_id', this.anonymousUserId);
    }
  }

  private getEffectiveUserId(): string | null {
    return this.currentUserId || this.anonymousUserId;
  }

  // Session Management
  async startSession(preset: Preset): Promise<string> {
    try {
      const sessionData: InsertSession = {
        userId: this.getEffectiveUserId(),
        presetName: preset.name,
        presetType: preset.type,
        technique: preset.technique || null,
        duration: preset.duration * 60, // Convert minutes to seconds
        completedDuration: 0,
        completionPercentage: 0,
        isCompleted: false,
        completedAt: null
      };

      const session = await apiRequest<Session>('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      this.activeSessionId = session.id;
      console.log('Started session:', session.id, preset.name);
      return session.id;
    } catch (error) {
      console.error('Failed to start session:', error);
      // Fallback to local session ID for offline support
      const fallbackId = this.generateSessionId();
      this.activeSessionId = fallbackId;
      return fallbackId;
    }
  }

  async completeSession(sessionId: string, completionPercentage: number = 100): Promise<void> {
    try {
      if (this.activeSessionId !== sessionId) {
        console.warn('Session ID mismatch');
        return;
      }

      // Calculate completed duration based on percentage
      const session = await this.getSession(sessionId);
      const completedDuration = session ? Math.round((session.duration * completionPercentage) / 100) : 0;

      await apiRequest(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedDuration,
          completionPercentage,
          isCompleted: completionPercentage >= 90,
          completedAt: new Date().toISOString()
        })
      });

      this.activeSessionId = null;
      console.log('Completed session:', sessionId, `${completionPercentage}%`);
    } catch (error) {
      console.error('Failed to complete session:', error);
      this.activeSessionId = null;
    }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    try {
      return await apiRequest<Session>(`/api/sessions/${sessionId}`);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      return null;
    }
  }

  // Session History
  async getAllSessions(): Promise<Session[]> {
    try {
      const effectiveUserId = this.getEffectiveUserId();
      const params = effectiveUserId ? `?userId=${effectiveUserId}` : '';
      return await apiRequest<Session[]>(`/api/sessions${params}`);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      return [];
    }
  }

  async getRecentSessions(limit: number = 10): Promise<Session[]> {
    const sessions = await this.getAllSessions();
    return sessions.slice(0, limit);
  }

  // Statistics
  async getSessionStats(): Promise<SessionStats> {
    try {
      const effectiveUserId = this.getEffectiveUserId();
      const params = effectiveUserId ? `?userId=${effectiveUserId}` : '';
      return await apiRequest<SessionStats>(`/api/stats${params}`);
    } catch (error) {
      console.error('Failed to fetch session stats:', error);
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
  }

  // Settings Management
  async saveSettings(settings: MeditationSettings): Promise<void> {
    try {
      const settingsData: InsertUserSettings = {
        userId: this.getEffectiveUserId(),
        ...settings
      };

      const effectiveUserId = this.getEffectiveUserId();
      const params = effectiveUserId ? `?userId=${effectiveUserId}` : '';
      await apiRequest(`/api/settings${params}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });

      console.log('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Fallback to localStorage for offline support
      localStorage.setItem('meditation_settings_fallback', JSON.stringify(settings));
    }
  }

  async getSettings(): Promise<MeditationSettings> {
    try {
      const effectiveUserId = this.getEffectiveUserId();
      const params = effectiveUserId ? `?userId=${effectiveUserId}` : '';
      const settings = await apiRequest<UserSettings>(`/api/settings${params}`);
      
      if (settings) {
        return {
          intervalBells: settings.intervalBells,
          intervalDuration: settings.intervalDuration,
          soundEnabled: settings.soundEnabled,
          bellSound: settings.bellSound,
          volume: settings.volume,
          visualCues: settings.visualCues,
          autoFadeInterface: settings.autoFadeInterface,
          fadeDuration: settings.fadeDuration
        };
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      
      // Try fallback localStorage
      const fallback = localStorage.getItem('meditation_settings_fallback');
      if (fallback) {
        try {
          return JSON.parse(fallback);
        } catch {
          // Ignore parse errors
        }
      }
    }

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

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string | null): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getActiveSessionId(): string | null {
    return this.activeSessionId;
  }

  // For development/testing - clear all data
  async clearAllData(): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      for (const session of sessions) {
        await apiRequest(`/api/sessions/${session.id}`, { method: 'DELETE' });
      }
      localStorage.removeItem('meditation_settings_fallback');
      this.activeSessionId = null;
      console.log('All meditation data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

export const sessionManager = new SessionManager();