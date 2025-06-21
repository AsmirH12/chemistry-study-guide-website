import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { LocalStorageManager } from "@/lib/localStorage";
import { topics } from "@/lib/topics";
import Home from "@/pages/home";
import TopicPage from "@/pages/topic";
import TopicsPage from "@/pages/topics";
import QuizPage from "@/pages/quiz";
import ProgressPage from "@/pages/progress";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/topics" component={TopicsPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/topic/:slug" component={TopicPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Calculate overall progress from local storage
  const calculateProgress = () => {
    const storedProgress = LocalStorageManager.getProgress();

    // Create progress data for all topics
    const progressForTopics = topics.map((topic) => {
      const stored = storedProgress.find((p) => p.topicId === topic.id);
      return stored ? stored.progress : 0;
    });

    // Calculate overall progress
    const totalProgress = progressForTopics.reduce(
      (sum, progress) => sum + progress,
      0
    );
    const overall = Math.round(totalProgress / progressForTopics.length);

    setOverallProgress(overall);
  };

  useEffect(() => {
    calculateProgress();
    LocalStorageManager.addTodayToStreakDates();
  }, []);

  // Listen for storage changes to refresh progress
  useEffect(() => {
    const handleStorageChange = () => {
      calculateProgress();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("quizCompleted", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quizCompleted", handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-ib-neutral-50">
          <Header
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            progress={overallProgress}
          />

          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 pb-20 lg:pb-8 lg:ml-80">
              <Router />
            </main>
          </div>

          <MobileNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
