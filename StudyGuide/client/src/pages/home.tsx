import { useState, useEffect } from "react";
import {
  Clock,
  Check,
  BookOpen,
  Bookmark,
  TrendingUp,
  ExternalLink,
  Globe,
  Book,
  Calculator,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodicTableWidget } from "@/components/periodic-table-widget";
import { ProgressTracker } from "@/components/progress-tracker";
import { LocalStorageManager } from "@/lib/localStorage";

export default function Home() {
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      time: string;
      icon: any;
      color: string;
    }>
  >([]);

  useEffect(() => {
    // Get recent activity from local storage
    const storedActivity = LocalStorageManager.getRecentActivity();

    // Convert stored activity to display format
    const activityForDisplay = storedActivity.slice(0, 5).map((activity) => {
      let icon = BookOpen;
      let color = "bg-ib-primary";

      if (activity.type === "quiz") {
        icon = Check;
        color = "bg-ib-success";
      } else if (activity.type === "formula") {
        icon = Calculator;
        color = "bg-ib-accent";
      }

      return {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        time: LocalStorageManager.getTimeAgo(activity.date),
        icon,
        color,
      };
    });

    // If no recent activity, show some default items
    if (activityForDisplay.length === 0) {
      setRecentActivity([
        {
          id: "welcome",
          type: "welcome",
          title: "Welcome to IB Chemistry Study Guide!",
          time: "Just now",
          icon: BookOpen,
          color: "bg-ib-primary",
        },
        {
          id: "start",
          type: "start",
          title: "Start exploring topics and taking quizzes",
          time: "Just now",
          icon: Check,
          color: "bg-ib-success",
        },
      ]);
    } else {
      setRecentActivity(activityForDisplay);
    }
  }, []);

  // Function to refresh recent activity
  const refreshRecentActivity = () => {
    const storedActivity = LocalStorageManager.getRecentActivity();

    const activityForDisplay = storedActivity.slice(0, 5).map((activity) => {
      let icon = BookOpen;
      let color = "bg-ib-primary";

      if (activity.type === "quiz") {
        icon = Check;
        color = "bg-ib-success";
      } else if (activity.type === "formula") {
        icon = Calculator;
        color = "bg-ib-accent";
      }

      return {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        time: LocalStorageManager.getTimeAgo(activity.date),
        icon,
        color,
      };
    });

    if (activityForDisplay.length > 0) {
      setRecentActivity(activityForDisplay);
    }
  };

  // Listen for storage changes to refresh data
  useEffect(() => {
    const handleStorageChange = () => {
      refreshRecentActivity();
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom events if needed
    window.addEventListener("quizCompleted", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quizCompleted", handleStorageChange);
    };
  }, []);

  const helpfulResources = [
    {
      id: 2,
      title: "Khan Academy Chemistry",
      description: "Free video lessons and practice problems",
      url: "https://www.khanacademy.org/science/chemistry",
      icon: Globe,
      category: "Learning",
    },
    {
      id: 3,
      title: "The Organic Chemistry Tutor",
      description:
        "Comprehensive chemistry tutorials and problem-solving videos",
      url: "https://www.youtube.com/c/TheOrganicChemistryTutor",
      icon: Play,
      category: "Learning",
    },
    {
      id: 4,
      title: "Bozeman Science",
      description: "AP and IB Chemistry video lessons by Paul Andersen",
      url: "https://www.youtube.com/@Bozemanscience1",
      icon: Play,
      category: "Learning",
    },
    {
      id: 5,
      title: "MolView",
      description: "3D molecular visualization and chemical structure viewer",
      url: "https://molview.org/",
      icon: Calculator,
      category: "Reference",
    },
    {
      id: 7,
      title: "PubChem",
      description: "Chemical information database from NIH",
      url: "https://pubchem.ncbi.nlm.nih.gov/",
      icon: Calculator,
      category: "Reference",
    },
    {
      id: 8,
      title: "PTables",
      description:
        "Interactive periodic table with detailed element information",
      url: "https://ptable.com/",
      icon: Globe,
      category: "Reference",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ib-neutral-800 mb-2">
          IB Chemistry Study Guide
        </h1>
        <p className="text-gray-600">
          Your comprehensive study companion for IB Chemistry
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-ib-neutral-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-ib-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div
                        className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ib-neutral-800">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <ProgressTracker />

          {/* Periodic Table Widget */}
          <PeriodicTableWidget />
        </div>

        {/* Right Column: Tools & Resources */}
        <div className="space-y-8">
          {/* Helpful Resources */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-ib-neutral-800 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-ib-primary" />
                Helpful Resources
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {helpfulResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border border-gray-200 hover:border-ib-primary hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-ib-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-ib-primary transition-colors">
                          <Icon className="w-4 h-4 text-ib-neutral-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-ib-neutral-800 group-hover:text-ib-primary transition-colors">
                              {resource.title}
                            </p>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-ib-primary transition-colors" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {resource.description}
                          </p>
                          <span className="inline-block text-xs text-ib-accent bg-ib-accent/10 px-2 py-1 rounded mt-2">
                            {resource.category}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
