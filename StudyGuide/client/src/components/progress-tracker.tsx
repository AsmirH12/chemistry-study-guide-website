import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topics } from "@/lib/topics";
import { LocalStorageManager } from "@/lib/localStorage";

export function ProgressTracker() {
  const [, setLocation] = useLocation();
  const [progressData, setProgressData] = useState<
    Array<{
      topicId: number;
      title: string;
      progress: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    // Get progress from local storage
    const storedProgress = LocalStorageManager.getProgress();

    // Create progress data for all topics
    const progressForTopics = topics.map((topic) => {
      const stored = storedProgress.find((p) => p.topicId === topic.id);
      const progress = stored ? stored.progress : 0;

      let color = "bg-gray-300";
      if (progress === 100) color = "bg-ib-secondary";
      else if (progress >= 50) color = "bg-ib-warning";

      return {
        topicId: topic.id,
        title: topic.title,
        progress,
        color,
      };
    });

    setProgressData(progressForTopics);
  }, []);

  // Function to refresh progress data
  const refreshProgressData = () => {
    const storedProgress = LocalStorageManager.getProgress();

    const progressForTopics = topics.map((topic) => {
      const stored = storedProgress.find((p) => p.topicId === topic.id);
      const progress = stored ? stored.progress : 0;

      let color = "bg-gray-300";
      if (progress === 100) color = "bg-ib-secondary";
      else if (progress >= 50) color = "bg-ib-warning";

      return {
        topicId: topic.id,
        title: topic.title,
        progress,
        color,
      };
    });

    setProgressData(progressForTopics);
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

  const overallProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.progress, 0) /
      progressData.length
  );

  const handleCardClick = () => {
    setLocation("/progress");
  };

  return (
    <Card
      className="bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-lg text-ib-neutral-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-ib-primary" />
          Study Progress
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.topicId}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Topic {item.topicId}: {item.title}
                </span>
                <span
                  className={`font-medium ${
                    item.progress >= 80
                      ? "text-ib-secondary"
                      : item.progress >= 50
                      ? "text-ib-warning"
                      : "text-gray-400"
                  }`}
                >
                  {item.progress}%
                </span>
              </div>
              <Progress value={item.progress} className="w-full h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="text-ib-primary font-semibold">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="w-full h-3 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
