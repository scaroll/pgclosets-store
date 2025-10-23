"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Palette,
  Home,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    id: string;
    label: string;
    image?: string;
    description?: string;
    points: Record<string, number>;
  }[];
}

interface QuizResult {
  style: string;
  title: string;
  description: string;
  image: string;
  products: string[];
  tips: string[];
}

interface StyleQuizProps {
  questions: QuizQuestion[];
  results: QuizResult[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function StyleQuiz({
  questions,
  results,
  title = "Find Your Perfect Style",
  subtitle = "Take our quick quiz to discover the ideal door style for your home",
  className
}: StyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const calculateResult = () => {
    // Calculate scores for each style
    const scores: Record<string, number> = {};

    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === optionId);

      if (option) {
        Object.entries(option.points).forEach(([style, points]) => {
          scores[style] = (scores[style] || 0) + points;
        });
      }
    });

    // Find the style with the highest score
    const topStyle = Object.entries(scores).reduce((a, b) =>
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    const quizResult = results.find(r => r.style === topStyle) || results[0];
    setResult(quizResult);
    setShowResult(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResult && result) {
    return (
      <div className={cn("py-16 md:py-24 bg-gradient-to-b from-teal-50 to-white", className)}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Your Style Profile</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Your Perfect Match: {result.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {result.description}
              </p>
            </div>

            {/* Result Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                {/* Products */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <Home className="w-5 h-5 text-teal-600" />
                    Recommended Products
                  </h3>
                  <div className="space-y-2">
                    {result.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-teal-600" />
                        <span className="text-gray-700">{product}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-teal-600" />
                    Design Tips
                  </h3>
                  <div className="space-y-3">
                    {result.tips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 flex-1">
                    Shop This Style
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1" onClick={restartQuiz}>
                    Retake Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <section className={cn("py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Quiz Container */}
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className={cn(
            "overflow-hidden shadow-xl transition-all duration-300",
            isAnimating ? "opacity-0 transform translate-x-8" : "opacity-100 transform translate-x-0"
          )}>
            <div className="p-8 md:p-12">
              {/* Question */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 rounded-full px-4 py-2 mb-4">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Style Question {currentQuestion + 1}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  {currentQ.question}
                </h3>
                {currentQ.description && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {currentQ.description}
                  </p>
                )}
              </div>

              {/* Options */}
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-4"
              >
                {currentQ.options.map((option) => (
                  <div key={option.id} className="relative">
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.id}
                      className={cn(
                        "flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all",
                        "peer-checked:border-teal-600 peer-checked:bg-teal-50",
                        "hover:border-gray-300 hover:bg-gray-50",
                        "peer-checked:hover:border-teal-600 peer-checked:hover:bg-teal-50"
                      )}
                    >
                      {option.image && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={option.image}
                            alt={option.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 mb-1">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        )}
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-teal-600 peer-checked:bg-teal-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Quiz Tips */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-gray-700">
                  Answer based on your true preferences to get the most accurate style recommendation.
                  There are no wrong answers - this is all about finding what feels right for you!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}