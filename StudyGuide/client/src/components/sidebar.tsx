import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { topics } from "@/lib/topics";
import { LocalStorageManager } from "@/lib/localStorage";

export function Sidebar() {
  const [location] = useLocation();
  const [topicProgress, setTopicProgress] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    // Get progress from local storage
    const progress = LocalStorageManager.getProgress();
    const progressMap: Record<number, number> = {};

    progress.forEach((p) => {
      progressMap[p.topicId] = p.progress;
    });

    setTopicProgress(progressMap);
  }, []);

  return (
    <aside className="hidden lg:block w-80 bg-white shadow-lg fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-ib-neutral-800 mb-4">
          IB Chemistry Topics
        </h2>
        {topics.map((topic, index) => {
          const isActive = location.includes(topic.slug);
          const progress = topicProgress[topic.id] || 0;
          const isCompleted = progress === 100;

          return (
            <div key={topic.id} className="mb-4">
              <Link href={`/topic/${topic.slug}`}>
                <div
                  className={cn(
                    "w-full flex items-center p-3 text-left font-medium rounded-lg cursor-pointer transition-colors",
                    isActive
                      ? "bg-ib-primary text-white"
                      : isCompleted
                      ? "bg-green-100 hover:bg-green-200 text-green-800 border border-green-300"
                      : "bg-ib-neutral-100 hover:bg-ib-neutral-200 text-ib-neutral-700"
                  )}
                >
                  <span>
                    {topic.order}. {topic.title}
                  </span>
                  {isCompleted && null}
                </div>
              </Link>
            </div>
          );
        })}
        {/* Quizzes Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-ib-neutral-800 mb-4">
            Quizzes
          </h2>
          <div className="mb-4">
            <Link href="/quiz">
              <div
                className={cn(
                  "w-full flex items-center p-3 text-left font-medium rounded-lg cursor-pointer transition-colors",
                  location === "/quiz"
                    ? "bg-ib-primary text-white"
                    : "bg-ib-neutral-100 hover:bg-ib-neutral-200 text-ib-neutral-700"
                )}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>All Quizzes</span>
              </div>
            </Link>
          </div>
        </div>
        {/* Progress Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-ib-neutral-800 mb-4">
            Progress
          </h2>
          <div className="mb-4">
            <Link href="/progress">
              <div
                className={cn(
                  "w-full flex items-center p-3 text-left font-medium rounded-lg cursor-pointer transition-colors",
                  location === "/progress"
                    ? "bg-ib-primary text-white"
                    : "bg-ib-neutral-100 hover:bg-ib-neutral-200 text-ib-neutral-700"
                )}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>View Progress</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
