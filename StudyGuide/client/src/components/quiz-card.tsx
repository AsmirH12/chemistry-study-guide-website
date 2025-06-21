import { useState } from "react";
import { CircleHelp, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LocalStorageManager } from "@/lib/localStorage";
import type { QuizQuestion } from "@/lib/quiz-data";

interface Quiz {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
}

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = quizCompleted
    ? 100
    : ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const answerIndex = parseInt(selectedAnswer);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Store the answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      // Quiz completed - calculate actual score based on correct answers
      const finalScore = Math.round((score / questions.length) * 100);
      const actualTimeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      setQuizCompleted(true);

      // Convert answers from string keys to number keys
      const answersWithNumberKeys: Record<number, number> = {};
      Object.entries(answers).forEach(([questionId, answerIndex]) => {
        answersWithNumberKeys[parseInt(questionId)] = answerIndex;
      });

      // Store quiz attempt in local storage
      LocalStorageManager.addQuizAttempt({
        quizId:
          quiz.difficulty === "easy" ? 1 : quiz.difficulty === "medium" ? 2 : 3,
        quizTitle: quiz.title,
        score: finalScore,
        totalQuestions: questions.length,
        timeSpent: actualTimeSpent, // Use actual time spent
        answers: answersWithNumberKeys,
      });

      // Add recent activity
      LocalStorageManager.addRecentActivity({
        type: "quiz",
        title: `Completed ${quiz.title}`,
        description: `Scored ${finalScore}% on ${quiz.title}`,
        score: finalScore,
      });

      // Update progress based on quiz performance
      // Map quiz difficulties to topic IDs (1-7 for the 7 topics)
      // For now, we'll distribute the quizzes across topics
      const topicId =
        quiz.difficulty === "easy" ? 1 : quiz.difficulty === "medium" ? 3 : 5;
      const timeSpentMinutes = Math.round(actualTimeSpent / 60); // Convert seconds to minutes

      if (finalScore === 100) {
        // Mark topic as completed only if score is 100%
        LocalStorageManager.updateProgress(topicId, 100, timeSpentMinutes);
      } else if (finalScore >= 80) {
        // Mark as in-progress if score is 80% or higher
        LocalStorageManager.updateProgress(topicId, 80, timeSpentMinutes);
      } else if (finalScore >= 50) {
        // Mark as in-progress if score is 50% or higher
        LocalStorageManager.updateProgress(topicId, 60, timeSpentMinutes);
      } else {
        // Mark as started if score is below 50%
        LocalStorageManager.updateProgress(topicId, 20, timeSpentMinutes);
      }

      // Dispatch custom event to notify other components to refresh
      window.dispatchEvent(
        new CustomEvent("quizCompleted", {
          detail: { quizId: quiz.difficulty, score: finalScore, topicId },
        })
      );
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setIsCorrect(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers({});
    setStartTime(Date.now());
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    }
  };

  if (quizCompleted) {
    const finalScore = Math.round((score / questions.length) * 100);

    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Check className="text-white w-5 h-5" />
              </div>
              <CardTitle className="text-xl text-ib-neutral-800">
                Quiz Complete!
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-ib-primary mb-2">
              {finalScore}%
            </div>
            <p className="text-gray-600">
              You scored {score} out of {questions.length} questions correctly
            </p>
          </div>

          <div className="mb-6">
            <Progress value={100} className="w-full h-2 mb-4" />
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRestartQuiz}
              className="bg-ib-primary hover:bg-ib-primary-dark text-white"
            >
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ib-secondary rounded-lg flex items-center justify-center mr-3">
              <CircleHelp className="text-white w-5 h-5" />
            </div>
            <CardTitle className="text-xl text-ib-neutral-800">
              {quiz.title}
            </CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Progress value={progress} className="w-full h-2 mb-4" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-ib-neutral-800 mb-4">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedAnswer(index.toString())}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showFeedback && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              isCorrect
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center mb-2">
              {isCorrect ? (
                <Check className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <X className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span
                className={`font-medium ${
                  isCorrect ? "text-green-800" : "text-red-800"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect."}
              </span>
            </div>
            <p
              className={`text-sm ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {!showFeedback ? (
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="bg-ib-primary hover:bg-ib-primary-dark text-white"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-ib-primary hover:bg-ib-primary-dark text-white"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Complete Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
