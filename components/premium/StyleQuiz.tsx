"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Palette,
  Home,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Gift,
  Share2,
  Download,
  Mail,
  ChevronRight,
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  type: 'image' | 'text' | 'multiple' | 'slider'
  category: 'style' | 'functionality' | 'budget' | 'lifestyle'
  options: QuizOption[]
  required?: boolean
}

interface QuizOption {
  id: string
  label: string
  value: string
  image?: string
  description?: string
  tags?: string[]
  points?: Record<string, number>
}

interface QuizResult {
  style: string
  description: string
  characteristics: string[]
  colors: string[]
  materials: string[]
  recommendations: ProductRecommendation[]
  score: number
  matchPercentage: number
}

interface ProductRecommendation {
  id: string
  name: string
  category: string
  price: number
  image: string
  matchScore: number
  reason: string
}

interface StyleQuizProps {
  questions: QuizQuestion[]
  recommendations: ProductRecommendation[]
  onQuizComplete?: (result: QuizResult, answers: Record<string, string>) => void
  enableShare?: boolean
  enableSave?: boolean
  showProgress?: boolean
  timeLimit?: number
  className?: string
}

export const StyleQuiz: React.FC<StyleQuizProps> = ({
  questions,
  recommendations,
  onQuizComplete,
  enableShare = true,
  enableSave = true,
  showProgress = true,
  timeLimit,
  className
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [isStarted, setIsStarted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (timeLimit && isStarted && !isQuizComplete && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && timeLimit) {
      // Auto-submit when time runs out
      handleSubmitQuiz()
    }
  }, [timeRemaining, isStarted, isQuizComplete, timeLimit])

  // Handle answer selection
  const handleAnswerSelect = (optionId: string) => {
    if (currentQuestion.type === 'multiple') {
      setSelectedAnswers(prev => {
        const newSet = new Set(prev)
        if (newSet.has(optionId)) {
          newSet.delete(optionId)
        } else {
          newSet.add(optionId)
        }
        return newSet
      })
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: optionId
      }))
      setSelectedAnswers(new Set([optionId]))
    }
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestion.type === 'multiple') {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: Array.from(selectedAnswers).join(',')
      }))
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswers(new Set())
    } else {
      handleSubmitQuiz()
    }
  }

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      const prevAnswer = answers[questions[currentQuestionIndex - 1].id]
      if (prevAnswer) {
        setSelectedAnswers(new Set(prevAnswer.split(',')))
      } else {
        setSelectedAnswers(new Set())
      }
    }
  }

  // Submit quiz and calculate results
  const handleSubmitQuiz = () => {
    // Calculate style score based on answers
    const styleScores: Record<string, number> = {}
    const allAnswers = Object.values(answers)

    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer) {
        const selectedOptions = question.options.filter(opt =>
          answer.includes(opt.id)
        )

        selectedOptions.forEach(option => {
          if (option.points) {
            Object.entries(option.points).forEach(([style, points]) => {
              styleScores[style] = (styleScores[style] || 0) + points
            })
          }
        })
      }
    })

    // Determine dominant style
    const dominantStyle = Object.entries(styleScores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'modern'

    // Generate recommendations based on style
    const filteredRecommendations = recommendations
      .map(rec => ({
        ...rec,
        matchScore: calculateMatchScore(dominantStyle, rec)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6)

    const result: QuizResult = {
      style: dominantStyle,
      description: getStyleDescription(dominantStyle),
      characteristics: getStyleCharacteristics(dominantStyle),
      colors: getStyleColors(dominantStyle),
      materials: getStyleMaterials(dominantStyle),
      recommendations: filteredRecommendations,
      score: Object.values(styleScores).reduce((a, b) => a + b, 0),
      matchPercentage: Math.min(100, Math.round((styleScores[dominantStyle] || 0) / 10))
    }

    setQuizResult(result)
    setIsQuizComplete(true)
    setShowResults(true)
    onQuizComplete?.(result, answers)
  }

  // Calculate match score for products
  const calculateMatchScore = (style: string, product: ProductRecommendation): number => {
    // Simple scoring algorithm - in real app, this would be more sophisticated
    const scoreMap: Record<string, Record<string, number>> = {
      modern: { 'minimalist': 95, 'contemporary': 90, 'scandinavian': 85 },
      traditional: { 'classic': 95, 'vintage': 90, 'rustic': 85 },
      eclectic: { 'bohemian': 95, 'industrial': 85, 'mid-century': 90 }
    }

    return scoreMap[style]?.[product.category.toLowerCase()] || 75
  }

  // Helper functions for style data
  const getStyleDescription = (style: string): string => {
    const descriptions: Record<string, string> = {
      modern: 'Clean lines, minimal ornamentation, and functional design',
      traditional: 'Timeless elegance, rich materials, and classic proportions',
      eclectic: 'Bold mix of patterns, colors, and eras',
      industrial: 'Raw materials, exposed elements, and utilitarian design',
      minimalist: 'Simple forms, neutral colors, and clutter-free spaces',
      bohemian: 'Free-spirited mix of textures, patterns, and global influences'
    }
    return descriptions[style] || 'Unique style tailored to your preferences'
  }

  const getStyleCharacteristics = (style: string): string[] => {
    const characteristics: Record<string, string[]> = {
      modern: ['Clean lines', 'Neutral colors', 'Geometric patterns', 'Functional design'],
      traditional: ['Rich materials', 'Classic patterns', 'Ornate details', 'Warm colors'],
      eclectic: ['Mixed patterns', 'Bold colors', 'Vintage elements', 'Artistic touches'],
      industrial: ['Raw materials', 'Exposed elements', 'Neutral palette', 'Utilitarian design'],
      minimalist: ['Simple forms', 'Limited colors', 'Clean spaces', 'Essential pieces'],
      bohemian: ['Natural materials', 'Global patterns', 'Plants', 'Textured fabrics']
    }
    return characteristics[style] || ['Unique characteristics']
  }

  const getStyleColors = (style: string): string[] => {
    const colors: Record<string, string[]> = {
      modern: ['#FFFFFF', '#000000', '#808080', '#E5E5E5'],
      traditional: ['#8B4513', '#D2691E', '#F5DEB3', '#708090'],
      eclectic: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
      industrial: ['#2F4F4F', '#696969', '#F5F5DC', '#8B4513'],
      minimalist: ['#FFFFFF', '#F5F5F5', '#D3D3D3', '#000000'],
      bohemian: ['#D2691E', '#8FBC8F', '#DDA0DD', '#F0E68C']
    }
    return colors[style] || ['#000000', '#FFFFFF']
  }

  const getStyleMaterials = (style: string): string[] => {
    const materials: Record<string, string[]> = {
      modern: ['Metal', 'Glass', 'Concrete', 'Polished wood'],
      traditional: ['Solid wood', 'Brass', 'Velvet', 'Marble'],
      eclectic: ['Mixed materials', 'Vintage finds', 'Natural fibers', 'Art pieces'],
      industrial: ['Raw steel', 'Reclaimed wood', 'Concrete', 'Leather'],
      minimalist: ['Natural wood', 'Stone', 'Linen', 'Steel'],
      bohemian: ['Rattan', 'Macrame', 'Bamboo', 'Cotton']
    }
    return materials[style] || ['Mixed materials']
  }

  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setQuizResult(null)
    setIsQuizComplete(false)
    setShowResults(false)
    setSelectedAnswers(new Set())
    setIsStarted(false)
    setTimeRemaining(timeLimit || 0)
  }

  // Share results
  const shareResults = async () => {
    if (!quizResult) return

    const shareData = {
      title: 'My Style Quiz Results',
      text: `I discovered my style is ${quizResult.style}! Take the quiz to find yours.`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  // Save results
  const saveResults = () => {
    if (!quizResult) return

    const resultsData = {
      quizResult,
      answers,
      date: new Date().toISOString()
    }

    localStorage.setItem('styleQuizResults', JSON.stringify(resultsData))
  }

  if (!isStarted) {
    return (
      <div className={`w-full max-w-2xl mx-auto ${className}`}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6" />
              Discover Your Style
            </CardTitle>
            <p className="text-muted-foreground">
              Take our quick quiz to find your perfect style and get personalized recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Personalized</h4>
                <p className="text-sm text-muted-foreground">Results tailored to your taste</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Quick & Easy</h4>
                <p className="text-sm text-muted-foreground">Only {questions.length} questions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Free Results</h4>
                <p className="text-sm text-muted-foreground">Instant recommendations</p>
              </div>
            </div>

            {timeLimit && (
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(timeLimit / 60)} minutes time limit
                </Badge>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={() => setIsStarted(true)}
            >
              Start Quiz
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults && quizResult) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Results Header */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Award className="h-6 w-6" />
                Your Style: {quizResult.style.charAt(0).toUpperCase() + quizResult.style.slice(1)}
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(quizResult.matchPercentage / 20)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {quizResult.matchPercentage}% Match
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-6">
                {quizResult.description}
              </p>

              {/* Style Characteristics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quizResult.characteristics.slice(0, 4).map((char, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{char}</p>
                  </div>
                ))}
              </div>

              {/* Color Palette */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Your Color Palette</h4>
                <div className="flex gap-2">
                  {quizResult.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 rounded-lg border-2 border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Preferred Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {quizResult.materials.map((material, index) => (
                    <Badge key={index} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                {enableShare && (
                  <Button variant="outline" onClick={shareResults}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                )}
                {enableSave && (
                  <Button variant="outline" onClick={saveResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Save Results
                  </Button>
                )}
                <Button onClick={restartQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizResult.recommendations.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full">
                      <CardContent className="pt-6">
                        <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium mb-2">{product.name}</h4>
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold">{product.price}</span>
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.matchScore / 20)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {product.matchScore}% match
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {product.reason}
                        </p>
                        <Button className="w-full" size="sm">
                          View Product
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          {showProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                {timeLimit && timeRemaining > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="outline" className="mb-2">
                  {currentQuestion.category}
                </Badge>
                <h3 className="text-xl font-semibold mb-2">
                  {currentQuestion.question}
                </h3>
                {currentQuestion.required && (
                  <p className="text-sm text-muted-foreground">Required</p>
                )}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAnswers.has(option.id) || answers[currentQuestion.id] === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(option.id)}
                    >
                      {currentQuestion.type === 'image' && option.image ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={option.image}
                            alt={option.label}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium">{option.label}</p>
                            {option.description && (
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{option.label}</p>
                          {option.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          )}
                          {option.tags && (
                            <div className="flex gap-1 mt-2">
                              {option.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestion.required &&
                    (selectedAnswers.size === 0 && !answers[currentQuestion.id])
                  }
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

export default StyleQuiz