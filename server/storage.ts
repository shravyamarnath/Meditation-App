import { 
  type User, 
  type InsertUser,
  type Session,
  type InsertSession,
  type UserSettings,
  type InsertUserSettings,
  type SessionStats
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for meditation app
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  getUserSessions(userId?: string): Promise<Session[]>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
  
  // User settings methods
  getUserSettings(userId?: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string | undefined, settings: Partial<UserSettings>): Promise<UserSettings | undefined>;
  
  // Analytics methods
  getSessionStats(userId?: string): Promise<SessionStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.userSettings = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Session methods
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      userId: insertSession.userId || null,
      technique: insertSession.technique || null,
      startedAt: new Date(),
      completedAt: insertSession.isCompleted ? new Date() : null
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getUserSessions(userId?: string): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .filter(session => userId ? session.userId === userId : !session.userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: Session = {
      ...session,
      ...updates,
      completedAt: updates.isCompleted ? new Date() : session.completedAt
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  // User settings methods
  async getUserSettings(userId?: string): Promise<UserSettings | undefined> {
    const settingsKey = userId || 'anonymous';
    return Array.from(this.userSettings.values())
      .find(settings => (settings.userId || 'anonymous') === settingsKey);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = {
      ...insertSettings,
      id,
      userId: insertSettings.userId || null,
      updatedAt: new Date()
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string | undefined, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settingsKey = userId || 'anonymous';
    const existing = Array.from(this.userSettings.values())
      .find(settings => (settings.userId || 'anonymous') === settingsKey);
    
    if (!existing) return undefined;
    
    const updatedSettings: UserSettings = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.userSettings.set(existing.id, updatedSettings);
    return updatedSettings;
  }

  // Analytics methods
  async getSessionStats(userId?: string): Promise<SessionStats> {
    const userSessions = await this.getUserSessions(userId);
    
    if (userSessions.length === 0) {
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

    const totalSessions = userSessions.length;
    const totalMinutes = Math.round(
      userSessions.reduce((sum, session) => sum + session.completedDuration, 0) / 60
    );
    
    // Calculate streaks (consecutive days with sessions)
    const dailySessions = this.groupSessionsByDay(userSessions);
    const currentStreak = this.calculateCurrentStreak(dailySessions);
    const longestStreak = this.calculateLongestStreak(dailySessions);
    
    // This week sessions
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeek = userSessions.filter(session => 
      new Date(session.startedAt) >= weekStart
    ).length;
    
    // Favorite type
    const typeCounts = userSessions.reduce((counts, session) => {
      counts[session.presetType] = (counts[session.presetType] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const favoriteType = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    // Last session
    const lastSessionDate = userSessions[0]?.startedAt;
    const lastSession = lastSessionDate ? this.formatTimeAgo(new Date(lastSessionDate)) : 'Never';
    
    return {
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      thisWeek,
      favoriteType,
      lastSession
    };
  }

  private groupSessionsByDay(sessions: Session[]): Record<string, Session[]> {
    return sessions.reduce((groups, session) => {
      const day = new Date(session.startedAt).toDateString();
      groups[day] = groups[day] || [];
      groups[day].push(session);
      return groups;
    }, {} as Record<string, Session[]>);
  }

  private calculateCurrentStreak(dailySessions: Record<string, Session[]>): number {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (!dailySessions[today] && !dailySessions[yesterday]) {
      return 0;
    }

    let streak = 0;
    let currentDate = dailySessions[today] ? new Date() : new Date(Date.now() - 86400000);
    
    while (true) {
      const dateString = currentDate.toDateString();
      if (!dailySessions[dateString]) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  private calculateLongestStreak(dailySessions: Record<string, Session[]>): number {
    const dates = Object.keys(dailySessions)
      .map(date => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length === 0) return 0;
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const dayDiff = Math.floor(
        (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return longestStreak;
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  }
}

export const storage = new MemStorage();
