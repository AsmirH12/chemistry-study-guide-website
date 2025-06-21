import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizAttemptSchema, insertBookmarkSchema, insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get topic by slug
  app.get("/api/topics/:slug", async (req, res) => {
    try {
      const topic = await storage.getTopicBySlug(req.params.slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Get quizzes for a topic
  app.get("/api/topics/:topicId/quizzes", async (req, res) => {
    try {
      const topicId = parseInt(req.params.topicId);
      const quizzes = await storage.getQuizzesByTopicId(topicId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Get quiz by ID
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quiz = await storage.getQuizById(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Get difficulty-based quizzes
  app.get("/api/quizzes/difficulty/:level", async (req, res) => {
    try {
      const level = req.params.level.toLowerCase();
      const levelMap: Record<string, string> = {
        easy: "Easy Chemistry Quiz",
        medium: "Medium Chemistry Quiz", 
        hard: "Hard Chemistry Quiz"
      };
      
      const targetTitle = levelMap[level];
      if (!targetTitle) {
        return res.status(404).json({ message: "Invalid difficulty level" });
      }

      // Get all quizzes and find the one with matching title
      const topics = await storage.getAllTopics();
      let targetQuiz = null;
      
      for (const topic of topics) {
        const quizzes = await storage.getQuizzesByTopicId(topic.id);
        targetQuiz = quizzes.find(quiz => quiz.title === targetTitle);
        if (targetQuiz) break;
      }

      if (!targetQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.json(targetQuiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Submit quiz attempt
  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const validatedData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(validatedData);
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ message: "Invalid quiz attempt data" });
    }
  });

  // Get user progress (mock user ID = 1 for now)
  app.get("/api/progress", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const { topicId, percentage } = req.body;
      const progress = await storage.updateUserProgress(userId, topicId, percentage);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to update progress" });
    }
  });

  // Get user bookmarks
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const validatedData = insertBookmarkSchema.parse({ ...req.body, userId });
      const bookmark = await storage.createBookmark(validatedData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:topicId", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const topicId = parseInt(req.params.topicId);
      await storage.deleteBookmark(userId, topicId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete bookmark" });
    }
  });

  // Get all quizzes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      const allQuizzes = [];
      for (const topic of topics) {
        const quizzes = await storage.getQuizzesByTopicId(topic.id);
        allQuizzes.push(...quizzes);
      }
      res.json(allQuizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all quizzes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
