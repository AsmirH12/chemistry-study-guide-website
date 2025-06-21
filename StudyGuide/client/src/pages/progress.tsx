import { useState, useEffect } from "react";
import { TrendingUp, Clock, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topics } from "@/lib/topics";
import { LocalStorageManager } from "@/lib/localStorage";

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<
    Array<{
      topicId: number;
      title: string;
      progress: number;
      timeSpent: string;
      lastStudied: string;
      status: string;
    }>
  >([]);

  const [overallStats, setOverallStats] = useState({
    overallProgress: 0,
    totalTimeSpent: "0m",
    completedTopics: 0,
    streak: 0,
  });

  useEffect(() => {
    // Get progress from local storage
    const storedProgress = LocalStorageManager.getProgress();
    const studyTimes = LocalStorageManager.getStudyTime();
    const quizAttempts = LocalStorageManager.getQuizAttempts();

    // Create progress data for all topics
    const progressForTopics = topics.map((topic) => {
      const stored = storedProgress.find((p) => p.topicId === topic.id);
      const studyTime = studyTimes.find((st) => st.topicId === topic.id);

      const progress = stored ? stored.progress : 0;
      const timeSpent = studyTime
        ? LocalStorageManager.formatTime(studyTime.timeSpent)
        : "0m";
      const lastStudied = stored
        ? LocalStorageManager.getTimeAgo(stored.lastStudied)
        : "Never";
      const status = stored ? stored.status : "not-started";

      return {
        topicId: topic.id,
        title: topic.title,
        progress,
        timeSpent,
        lastStudied,
        status,
      };
    });

    setProgressData(progressForTopics);

    // Calculate overall stats
    const totalProgress = progressForTopics.reduce(
      (sum, item) => sum + item.progress,
      0
    );
    const overallProgress = Math.round(
      totalProgress / progressForTopics.length
    );
    const completedTopics = progressForTopics.filter(
      (item) => item.progress === 100
    ).length; // Only 100% counts as completed

    // Calculate total time spent on site (study time + quiz time)
    const totalStudyTimeMinutes = studyTimes.reduce(
      (sum, st) => sum + st.timeSpent,
      0
    );
    const totalQuizTimeSeconds = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.timeSpent,
      0
    );
    const totalQuizTimeMinutes = Math.round(totalQuizTimeSeconds / 60);
    const totalSiteTimeMinutes = totalStudyTimeMinutes + totalQuizTimeMinutes;
    const totalTimeSpent = LocalStorageManager.formatTime(totalSiteTimeMinutes);

    // Calculate streak (real consecutive days)
    const streak = LocalStorageManager.calculateStreak();

    setOverallStats({
      overallProgress,
      totalTimeSpent,
      completedTopics,
      streak,
    });
  }, []); // Empty dependency array means this runs once on mount

  // Function to refresh progress data
  const refreshProgressData = () => {
    const storedProgress = LocalStorageManager.getProgress();
    const studyTimes = LocalStorageManager.getStudyTime();
    const quizAttempts = LocalStorageManager.getQuizAttempts();

    const progressForTopics = topics.map((topic) => {
      const stored = storedProgress.find((p) => p.topicId === topic.id);
      const studyTime = studyTimes.find((st) => st.topicId === topic.id);

      const progress = stored ? stored.progress : 0;
      const timeSpent = studyTime
        ? LocalStorageManager.formatTime(studyTime.timeSpent)
        : "0m";
      const lastStudied = stored
        ? LocalStorageManager.getTimeAgo(stored.lastStudied)
        : "Never";
      const status = stored ? stored.status : "not-started";

      return {
        topicId: topic.id,
        title: topic.title,
        progress,
        timeSpent,
        lastStudied,
        status,
      };
    });

    setProgressData(progressForTopics);

    const totalProgress = progressForTopics.reduce(
      (sum, item) => sum + item.progress,
      0
    );
    const overallProgress = Math.round(
      totalProgress / progressForTopics.length
    );
    const completedTopics = progressForTopics.filter(
      (item) => item.progress === 100
    ).length; // Only 100% counts as completed

    // Calculate total time spent on site (study time + quiz time)
    const totalStudyTimeMinutes = studyTimes.reduce(
      (sum, st) => sum + st.timeSpent,
      0
    );
    const totalQuizTimeSeconds = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.timeSpent,
      0
    );
    const totalQuizTimeMinutes = Math.round(totalQuizTimeSeconds / 60);
    const totalSiteTimeMinutes = totalStudyTimeMinutes + totalQuizTimeMinutes;
    const totalTimeSpent = LocalStorageManager.formatTime(totalSiteTimeMinutes);

    // Calculate streak (real consecutive days)
    const streak = LocalStorageManager.calculateStreak();

    setOverallStats({
      overallProgress,
      totalTimeSpent,
      completedTopics,
      streak,
    });
  };

  // Listen for storage changes to refresh data
  useEffect(() => {
    const handleStorageChange = () => {
      refreshProgressData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("quizCompleted", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quizCompleted", handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ib-neutral-800 mb-2">
          Progress Overview
        </h1>
        <p className="text-gray-600">
          Track your learning journey through IB Chemistry
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-ib-neutral-800">
                  {overallStats.overallProgress}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-ib-primary" />
            </div>
            <Progress
              value={overallStats.overallProgress}
              className="w-full h-2 mt-4"
            />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Time Spent</p>
                <p className="text-2xl font-bold text-ib-neutral-800">
                  {overallStats.totalTimeSpent}
                </p>
              </div>
              <Clock className="w-8 h-8 text-ib-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Topics</p>
                <p className="text-2xl font-bold text-ib-neutral-800">
                  {overallStats.completedTopics}/{progressData.length}
                </p>
              </div>
              <Target className="w-8 h-8 text-ib-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-ib-neutral-800">
                  {overallStats.streak} days
                </p>
              </div>
              <Award className="w-8 h-8 text-ib-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-ib-neutral-800">
            Topic Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progressData.map((item, index) => (
              <div
                key={item.topicId}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-ib-neutral-800">
                      Topic {item.topicId}: {item.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Last studied: {item.lastStudied}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "started"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-ib-neutral-800">
                      {item.progress}%
                    </p>
                  </div>
                </div>
                <Progress value={item.progress} className="w-full h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
