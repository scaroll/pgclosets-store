"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OptimizedImage } from "@/ui/optimized-image"
import { cn } from "@/lib/utils"

interface Tool {
  id: string
  name: string
  required: boolean
  imageUrl?: string
  description?: string
}

interface Material {
  id: string
  name: string
  quantity: string
  partNumber?: string
  included: boolean
}

interface Annotation {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: 'info' | 'warning' | 'tip' | 'measurement'
}

interface StepMedia {
  id: string
  type: 'image' | 'video' | 'diagram' | '3d-model'
  url: string
  thumbnailUrl?: string
  caption: string
  annotations: Annotation[]
  duration?: number // for videos
}

interface InstallationStep {
  id: string
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  media: StepMedia[]
  tips: string[]
  warnings: string[]
  checkpoints: string[]
  nextSteps?: string[]
}

interface InstallationGuide {
  id: string
  productId: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  tools: Tool[]
  materials: Material[]
  steps: InstallationStep[]
  safetyNotes: string[]
  troubleshooting: { issue: string; solution: string }[]
}

interface InteractiveInstallationGuideProps {
  guide: InstallationGuide
  onComplete?: (completedSteps: string[]) => void
  className?: string
}

export function InteractiveInstallationGuide({
  guide,
  onComplete,
  className
}: InteractiveInstallationGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [checkedCheckpoints, setCheckedCheckpoints] = useState<Set<string>>(new Set())
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [userProgress, setUserProgress] = useState({
    timeSpent: 0,
    pausedAt: null as Date | null,
    notes: [] as { stepId: string; note: string; timestamp: Date }[]
  })

  const currentStep = guide.steps[currentStepIndex]
  const currentMedia = currentStep?.media[activeMediaIndex]
  const progressPercentage = (completedSteps.size / guide.steps.length) * 100

  // Save progress to localStorage
  useEffect(() => {
    const saveProgress = () => {
      const progress = {
        guideId: guide.id,
        currentStepIndex,
        completedSteps: Array.from(completedSteps),
        checkedCheckpoints: Array.from(checkedCheckpoints),
        userProgress,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(`installation-guide-${guide.id}`, JSON.stringify(progress))
    }

    saveProgress()
  }, [guide.id, currentStepIndex, completedSteps, checkedCheckpoints, userProgress])

  // Load progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem(`installation-guide-${guide.id}`)
      if (saved) {
        try {
          const progress = JSON.parse(saved)
          setCurrentStepIndex(progress.currentStepIndex || 0)
          setCompletedSteps(new Set(progress.completedSteps || []))
          setCheckedCheckpoints(new Set(progress.checkedCheckpoints || []))
          setUserProgress(progress.userProgress || { timeSpent: 0, pausedAt: null, notes: [] })
        } catch (error) {
          console.warn('Failed to load installation progress:', error)
        }
      }
    }

    loadProgress()
  }, [guide.id])

  const navigateToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < guide.steps.length) {
      setCurrentStepIndex(stepIndex)
      setActiveMediaIndex(0)
      setSelectedAnnotation(null)
    }
  }

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set(prev).add(stepId))

    // Auto-advance to next step
    if (currentStepIndex < guide.steps.length - 1) {
      setTimeout(() => navigateToStep(currentStepIndex + 1), 1000)
    } else {
      // Guide completed
      onComplete?.(Array.from(completedSteps))
    }
  }

  const toggleCheckpoint = (checkpointId: string) => {
    setCheckedCheckpoints(prev => {
      const newSet = new Set(prev)
      if (newSet.has(checkpointId)) {
        newSet.delete(checkpointId)
      } else {
        newSet.add(checkpointId)
      }
      return newSet
    })
  }

  const addUserNote = (note: string) => {
    setUserProgress(prev => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          stepId: currentStep.id,
          note,
          timestamp: new Date()
        }
      ]
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const StepNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToStep(currentStepIndex - 1)}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {guide.steps.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToStep(currentStepIndex + 1)}
          disabled={currentStepIndex === guide.steps.length - 1}
        >
          Next
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Progress value={progressPercentage} className="w-32" />
        <span className="text-sm text-muted-foreground">
          {Math.round(progressPercentage)}% complete
        </span>
      </div>
    </div>
  )

  const MediaViewer = () => (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {currentMedia?.type === 'video' ? (
            <video
              src={currentMedia.url}
              poster={currentMedia.thumbnailUrl}
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative w-full h-full">
              <OptimizedImage
                src={currentMedia?.url || "/placeholder.svg"}
                alt={currentMedia?.caption || currentStep.title}
                fill
                className="object-cover"
                priority
              />

              {/* Annotations overlay */}
              {showAnnotations && currentMedia?.annotations.map((annotation) => (
                <button
                  key={annotation.id}
                  className={cn(
                    "absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110",
                    annotation.type === 'info' && "bg-blue-500",
                    annotation.type === 'warning' && "bg-red-500",
                    annotation.type === 'tip' && "bg-green-500",
                    annotation.type === 'measurement' && "bg-purple-500",
                    selectedAnnotation?.id === annotation.id && "ring-2 ring-white"
                  )}
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedAnnotation(annotation)}
                >
                  <span className="sr-only">{annotation.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Media navigation */}
          {currentStep.media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {currentStep.media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMediaIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    activeMediaIndex === index ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Annotation toggle */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => setShowAnnotations(!showAnnotations)}
          >
            <InfoIcon className="w-4 h-4 mr-1" />
            {showAnnotations ? 'Hide' : 'Show'} Info
          </Button>
        </div>

        {currentMedia?.caption && (
          <div className="p-4 border-t">
            <p className="text-sm text-muted-foreground">{currentMedia.caption}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const AnnotationPanel = () => (
    <AnimatePresence>
      {selectedAnnotation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">{selectedAnnotation.title}</div>
                <div>{selectedAnnotation.description}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAnnotation(null)}
                >
                  Close
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const StepContent = () => (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Step {currentStep.stepNumber}: {currentStep.title}
                <Badge className={getDifficultyColor(currentStep.difficulty)}>
                  {currentStep.difficulty}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="w-4 h-4" />
                {currentStep.estimatedTime}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentStep.description}</p>

            {/* Warnings */}
            {currentStep.warnings.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">Important Safety Information</div>
                    <ul className="list-disc list-inside space-y-1">
                      {currentStep.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Tips */}
            {currentStep.tips.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-2">Pro Tips</div>
                    <ul className="space-y-1">
                      {currentStep.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-blue-800">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <MediaViewer />
        <AnnotationPanel />
      </div>

      <div className="space-y-6">
        {/* Checkpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checkpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStep.checkpoints.map((checkpoint, index) => {
                const checkpointId = `${currentStep.id}-checkpoint-${index}`
                const isChecked = checkedCheckpoints.has(checkpointId)

                return (
                  <label
                    key={checkpointId}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckpoint(checkpointId)}
                      className="mt-1"
                    />
                    <span className={cn(
                      "text-sm transition-all",
                      isChecked && "line-through text-muted-foreground"
                    )}>
                      {checkpoint}
                    </span>
                  </label>
                )
              })}
            </div>

            {currentStep.checkpoints.length > 0 && (
              <Button
                onClick={() => markStepComplete(currentStep.id)}
                disabled={completedSteps.has(currentStep.id)}
                className="w-full mt-4"
              >
                {completedSteps.has(currentStep.id) ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Step Completed
                  </>
                ) : (
                  'Mark Step Complete'
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tools & Materials Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tools & Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tools">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>
              <TabsContent value="tools" className="space-y-2">
                {guide.tools.map((tool) => (
                  <div key={tool.id} className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      tool.required ? "bg-red-500" : "bg-gray-300"
                    )} />
                    <span className="text-sm">{tool.name}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="materials" className="space-y-2">
                {guide.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between">
                    <span className="text-sm">{material.name}</span>
                    <Badge variant={material.included ? "default" : "outline"}>
                      {material.quantity}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className={cn("max-w-7xl mx-auto p-6", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{guide.title}</h1>
            <p className="text-muted-foreground mt-1">{guide.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(guide.difficulty)}>
              {guide.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ClockIcon className="w-4 h-4" />
              {guide.estimatedTime}
            </div>
          </div>
        </div>

        <StepNavigation />
      </div>

      {/* Content */}
      <StepContent />
    </div>
  )
}

// Icon components
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)