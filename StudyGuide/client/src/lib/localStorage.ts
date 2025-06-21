// Local storage keys
const STORAGE_KEYS = {
  PROGRESS: "chemistry-progress",
  QUIZ_ATTEMPTS: "chemistry-quiz-attempts",
  RECENT_ACTIVITY: "chemistry-recent-activity",
  STUDY_TIME: "chemistry-study-time",
  LAST_VISITED: "chemistry-last-visited",
  STREAK_DATES: "chemistry-streak-dates",
} as const;

// Types for local storage data
export interface LocalProgress {
  topicId: number;
  progress: number;
  timeSpent: number; // in minutes
  lastStudied: string; // ISO date string
  status: "not-started" | "started" | "in-progress" | "completed";
}

export interface QuizAttempt {
  id: string;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  date: string; // ISO date string
  answers: Record<number, number>;
}

export interface RecentActivity {
  id: string;
  type: "topic" | "quiz" | "formula";
  title: string;
  description: string;
  date: string; // ISO date string
  progress?: number;
  score?: number;
}

export interface StudyTime {
  topicId: number;
  timeSpent: number; // in minutes
  lastUpdated: string; // ISO date string
}

// Local storage utility functions
export class LocalStorageManager {
  // Progress management
  static getProgress(): LocalProgress[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static updateProgress(
    topicId: number,
    progress: number,
    timeSpent: number = 0
  ): void {
    const allProgress = this.getProgress();
    const existingIndex = allProgress.findIndex((p) => p.topicId === topicId);

    const now = new Date().toISOString();
    const status =
      progress === 100
        ? "completed"
        : progress >= 50
        ? "in-progress"
        : progress > 0
        ? "started"
        : "not-started";

    if (existingIndex >= 0) {
      allProgress[existingIndex] = {
        ...allProgress[existingIndex],
        progress,
        timeSpent: allProgress[existingIndex].timeSpent + timeSpent,
        lastStudied: now,
        status,
      };
    } else {
      allProgress.push({
        topicId,
        progress,
        timeSpent,
        lastStudied: now,
        status,
      });
    }

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
  }

  static getProgressForTopic(topicId: number): LocalProgress | null {
    const allProgress = this.getProgress();
    return allProgress.find((p) => p.topicId === topicId) || null;
  }

  // Quiz attempts management
  static getQuizAttempts(): QuizAttempt[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addQuizAttempt(attempt: Omit<QuizAttempt, "id" | "date">): void {
    const attempts = this.getQuizAttempts();
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
    };

    attempts.push(newAttempt);
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));
  }

  static getQuizAttemptsForQuiz(quizId: number): QuizAttempt[] {
    const allAttempts = this.getQuizAttempts();
    return allAttempts.filter((attempt) => attempt.quizId === quizId);
  }

  static getQuizStats(quizId: number) {
    const attempts = this.getQuizAttemptsForQuiz(quizId);
    if (attempts.length === 0) return null;

    const scores = attempts.map((a) => a.score);
    const times = attempts.map((a) => a.timeSpent);

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      bestScore: Math.max(...scores),
      averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      totalTime: times.reduce((a, b) => a + b, 0),
    };
  }

  static getAllQuizStats() {
    const attempts = this.getQuizAttempts();
    if (attempts.length === 0) return null;

    const scores = attempts.map((a) => a.score);
    const times = attempts.map((a) => a.timeSpent);

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      bestScore: Math.max(...scores),
      averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      totalTime: times.reduce((a, b) => a + b, 0),
    };
  }

  // Recent activity management
  static getRecentActivity(): RecentActivity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addRecentActivity(
    activity: Omit<RecentActivity, "id" | "date">
  ): void {
    const activities = this.getRecentActivity();
    const newActivity: RecentActivity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
    };

    activities.unshift(newActivity); // Add to beginning
    // Keep only last 10 activities
    if (activities.length > 10) {
      activities.splice(10);
    }

    localStorage.setItem(
      STORAGE_KEYS.RECENT_ACTIVITY,
      JSON.stringify(activities)
    );
  }

  // Study time management
  static getStudyTime(): StudyTime[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDY_TIME);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static updateStudyTime(topicId: number, additionalTime: number): void {
    const studyTimes = this.getStudyTime();
    const existingIndex = studyTimes.findIndex((st) => st.topicId === topicId);

    if (existingIndex >= 0) {
      studyTimes[existingIndex] = {
        ...studyTimes[existingIndex],
        timeSpent: studyTimes[existingIndex].timeSpent + additionalTime,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      studyTimes.push({
        topicId,
        timeSpent: additionalTime,
        lastUpdated: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEYS.STUDY_TIME, JSON.stringify(studyTimes));
  }

  // Streak management
  static addTodayToStreakDates(): void {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let streakDates: string[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK_DATES);
      streakDates = stored ? JSON.parse(stored) : [];
    } catch {
      streakDates = [];
    }
    if (!streakDates.includes(today)) {
      streakDates.push(today);
      localStorage.setItem(
        STORAGE_KEYS.STREAK_DATES,
        JSON.stringify(streakDates)
      );
    }
  }

  static getStreakDates(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK_DATES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static calculateStreak(): number {
    const streakDates = this.getStreakDates().sort();
    if (streakDates.length === 0) return 0;
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    for (let i = streakDates.length - 1; i >= 0; i--) {
      const date = new Date(streakDates[i]);
      date.setHours(0, 0, 0, 0);
      if (date.getTime() === current.getTime()) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else if (date.getTime() < current.getTime()) {
        break;
      }
    }
    return streak;
  }

  // Utility functions
  static formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  static formatTimeSpent(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  }

  static getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  }

  // Clear all data (for testing/reset)
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
