import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Book, ChevronRight, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Topic } from "@shared/schema";

export default function TopicsPage() {
  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  // Mock progress data for each topic
  const mockProgress = [85, 60, 25, 10, 0, 0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-ib-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ib-neutral-800 mb-2">IB Chemistry Topics</h1>
        <p className="text-gray-600">Explore all the essential topics covered in IB Chemistry curriculum</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => {
          const progress = mockProgress[index] || 0;
          const estimatedTime = [12, 15, 18, 20, 14, 16][index] || 10;
          
          return (
            <Link key={topic.id} href={`/topic/${topic.slug}`}>
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-ib-primary rounded-lg flex items-center justify-center">
                        <Book className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">
                          Topic {topic.order}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-ib-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg text-ib-neutral-800 group-hover:text-ib-primary transition-colors">
                    {topic.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className={`font-medium ${
                        progress >= 80 ? 'text-ib-secondary' :
                        progress >= 50 ? 'text-ib-warning' :
                        progress > 0 ? 'text-ib-primary' :
                        'text-gray-400'
                      }`}>
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="w-full h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {estimatedTime} hours
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {progress > 0 ? 'In Progress' : 'Not Started'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {topics.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Topics Available</h2>
            <p className="text-gray-600">Topics will appear here as they are added to the curriculum.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}