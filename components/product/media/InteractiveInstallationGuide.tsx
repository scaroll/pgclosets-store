"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench,
  Eye,
  Download,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { cn } from "@/lib/utils"

interface InstallationStep {
  id: string
  title: string
  description: string
  image?: string
  video?: string
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  tools: string[]
  materials: string[]
  tips: string[]
  warnings: string[]
  checkpoints: string[]
}

interface InteractiveInstallationGuideProps {
  productName: string
  steps: InstallationStep[]
  totalTime: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  className?: string
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
}

const skillLevelColors = {
  beginner: 'bg-blue-100 text-blue-800',
  intermediate: 'bg-purple-100 text-purple-800',
  advanced: 'bg-red-100 text-red-800'
}

export function InteractiveInstallationGuide({
  productName,
  steps,
  totalTime,
  skillLevel,
  className
}: InteractiveInstallationGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']))

  const currentStepData = steps[currentStep]
  const progress = (completedSteps.size / steps.length) * 100

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
      setIsPlaying(false)
    }
  }, [steps.length])

  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1)
    }
  }, [currentStep, steps.length, goToStep])

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const markStepComplete = useCallback(() => {
    setCompletedSteps(prev => new Set(prev).add(currentStep))
    if (currentStep < steps.length - 1) {
      setTimeout(goToNextStep, 500)
    }
  }, [currentStep, steps.length, goToNextStep])

  const resetProgress = useCallback(() => {
    setCompletedSteps(new Set())
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }, [])

  const allTools = Array.from(new Set(steps.flatMap(step => step.tools)))
  const allMaterials = Array.from(new Set(steps.flatMap(step => step.materials)))

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Installation Guide: {productName}
              </CardTitle>
              <CardDescription>
                Step-by-step installation instructions with visual guides
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Installation Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="font-medium">{totalTime}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <Badge className={skillLevelColors[skillLevel]}>
                {skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Skill Level</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="font-medium">{steps.length} Steps</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps.size} of {steps.length} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Tools and Materials */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <button
                onClick={() => toggleSection('tools')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Required Tools ({allTools.length})</span>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  expandedSections.has('tools') && "rotate-90"
                )} />
              </button>
              <AnimatePresence>
                {expandedSections.has('tools') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-1 text-sm text-gray-600">
                      {allTools.map((tool, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                onClick={() => toggleSection('materials')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Materials ({allMaterials.length})</span>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  expandedSections.has('materials') && "rotate-90"
                )} />
              </button>
              <AnimatePresence>
                {expandedSections.has('materials') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-1 text-sm text-gray-600">
                      {allMaterials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-blue-600" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Installation Steps</h3>
            <Button onClick={resetProgress} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={cn(
                  "p-2 rounded-lg text-left transition-all duration-200",
                  currentStep === index
                    ? "bg-pg-sky text-white"
                    : completedSteps.has(index)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {index + 1}
                  </span>
                  {completedSteps.has(index) && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                </div>
                <div className="text-xs truncate">
                  {step.title}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Detail */}
      {currentStepData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-pg-sky text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                    {currentStep + 1}
                  </span>
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentStepData.duration}
                  </div>
                  <Badge className={difficultyColors[currentStepData.difficulty]}>
                    {currentStepData.difficulty}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step Media */}
            {(currentStepData.image || currentStepData.video) && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {currentStepData.video ? (
                  <div className="relative w-full h-full">
                    <video
                      src={currentStepData.video}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </div>
                ) : currentStepData.image ? (
                  <OptimizedImage
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                  />
                ) : null}
              </div>
            )}

            {/* Step Description */}
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Step-specific Tools and Materials */}
            {(currentStepData.tools.length > 0 || currentStepData.materials.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {currentStepData.tools.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tools Needed</h4>
                    <ul className="space-y-1">
                      {currentStepData.tools.map((tool, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Wrench className="w-3 h-3 text-gray-600" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.materials.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Materials</h4>
                    <ul className="space-y-1">
                      {currentStepData.materials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-gray-600" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            {currentStepData.tips.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Pro Tips</h4>
                <ul className="space-y-1">
                  {currentStepData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-700">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {currentStepData.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Warnings
                </h4>
                <ul className="space-y-1">
                  {currentStepData.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      ⚠️ {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checkpoints */}
            {currentStepData.checkpoints.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✅ Verification Checkpoints</h4>
                <ul className="space-y-2">
                  {currentStepData.checkpoints.map((checkpoint, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {checkpoint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {!completedSteps.has(currentStep) && (
                  <Button
                    onClick={markStepComplete}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </Button>
                )}

                <Button
                  onClick={goToNextStep}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {completedSteps.size === steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-green-50 border border-green-200 rounded-lg"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Installation Complete! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            Congratulations! You've successfully installed your {productName}.
          </p>
          <Button onClick={resetProgress} variant="outline">
            Start New Installation
          </Button>
        </motion.div>
      )}
    </div>
  )
}