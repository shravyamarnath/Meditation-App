import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, updateSessionSchema, insertUserSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(400).json({ error: 'Invalid session data' });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const { userId } = req.query;
      const sessions = await storage.getUserSessions(userId as string);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ error: 'Failed to fetch session' });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      // Validate and whitelist only allowed fields for session updates
      const validatedUpdates = updateSessionSchema.parse(req.body);
      const updatedSession = await storage.updateSession(req.params.id, validatedUpdates);
      if (!updatedSession) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(updatedSession);
    } catch (error) {
      console.error('Error updating session:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid update data' });
      }
      res.status(500).json({ error: 'Failed to update session' });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const { userId } = req.query;
      const settings = await storage.getUserSettings(userId as string);
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error('Error creating settings:', error);
      res.status(400).json({ error: 'Invalid settings data' });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const { userId } = req.query;
      const updatedSettings = await storage.updateUserSettings(userId as string, req.body);
      if (!updatedSettings) {
        // Create settings if they don't exist
        const validatedData = insertUserSettingsSchema.parse({
          ...req.body,
          userId: userId as string
        });
        const newSettings = await storage.createUserSettings(validatedData);
        return res.json(newSettings);
      }
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const { userId } = req.query;
      const stats = await storage.getSessionStats(userId as string);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
