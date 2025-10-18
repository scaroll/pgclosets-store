"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Smartphone, RotateCcw, Move3D, X, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ARDoorViewerProps {
  productName: string
  modelUrl?: string
  arModelUrl?: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  availableFinishes?: string[]
  className?: string
}

interface ARCapabilities {
  webxr: boolean
  arcore: boolean
  arkit: boolean
  quickLook: boolean
}

export function ARDoorViewer({
  productName,
  modelUrl,
  arModelUrl,
  dimensions,
  availableFinishes = [],
  className
}: ARDoorViewerProps) {
  const [isARActive, setIsARActive] = useState(false)
  const [selectedFinish, setSelectedFinish] = useState(availableFinishes[0] || "")
  const [scale, setScale] = useState([1])
  const [rotation, setRotation] = useState([0])
  const [arCapabilities, setARCapabilities] = useState<ARCapabilities>({
    webxr: false,
    arcore: false,
    arkit: false,
    quickLook: false
  })
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check device AR capabilities
  useEffect(() => {
    const checkARCapabilities = async () => {
      setIsChecking(true)
      const capabilities: ARCapabilities = {
        webxr: false,
        arcore: false,
        arkit: false,
        quickLook: false
      }

      try {
        // Check for WebXR support
        if ('xr' in navigator) {
          const xr = (navigator as any).xr
          if (xr) {
            try {
              const supported = await xr.isSessionSupported('immersive-ar')
              capabilities.webxr = supported
            } catch (e) {
              console.log('WebXR AR not supported')
            }
          }
        }

        // Check for ARCore (Android)
        const userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.includes('android')) {
          capabilities.arcore = true
        }

        // Check for ARKit (iOS)
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
          capabilities.arkit = true
          capabilities.quickLook = true
        }

        setARCapabilities(capabilities)
      } catch (err) {
        setError('Failed to check AR capabilities')
      } finally {
        setIsChecking(false)
      }
    }

    checkARCapabilities()
  }, [])

  const hasARSupport = Object.values(arCapabilities).some(Boolean)

  const startARSession = useCallback(async () => {
    if (!hasARSupport) {
      setError('AR is not supported on this device')
      return
    }

    try {
      setIsARActive(true)
      setError(null)

      // For iOS devices, use AR Quick Look
      if (arCapabilities.quickLook && arModelUrl) {
        const anchor = document.createElement('a')
        anchor.href = arModelUrl
        anchor.setAttribute('rel', 'ar')
        anchor.click()
        return
      }

      // For WebXR compatible devices
      if (arCapabilities.webxr && 'xr' in navigator) {
        const xr = (navigator as any).xr
        const session = await xr.requestSession('immersive-ar', {
          requiredFeatures: ['local', 'hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body }
        })

        // Initialize WebXR AR session
        // This would typically involve WebGL/Three.js setup
        console.log('WebXR AR session started', session)
      }

    } catch (err) {
      setError('Failed to start AR session')
      setIsARActive(false)
    }
  }, [hasARSupport, arCapabilities, arModelUrl])

  const stopARSession = useCallback(() => {
    setIsARActive(false)
    setError(null)
  }, [])

  const resetView = useCallback(() => {
    setScale([1])
    setRotation([0])
  }, [])

  const handleFinishChange = useCallback((finish: string) => {
    setSelectedFinish(finish)
  }, [])

  if (isChecking) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-pg-sky border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-600">Checking AR capabilities...</p>
        </CardContent>
      </Card>
    )
  }

  if (!hasARSupport) {
    return (
      <Card className={cn("border-orange-200 bg-orange-50", className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">AR Preview Not Available</CardTitle>
          </div>
          <CardDescription>
            AR viewing requires a compatible device with AR capabilities (ARKit on iOS or ARCore on Android).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              To use AR preview, try accessing this page on:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• iPhone or iPad (iOS 12+)</li>
              <li>• Android device with ARCore support</li>
              <li>• Compatible web browser (Safari, Chrome)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              AR Preview
            </CardTitle>
            <CardDescription>
              View {productName} in your space using augmented reality
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {arCapabilities.webxr && <Badge variant="outline">WebXR</Badge>}
            {arCapabilities.arkit && <Badge variant="outline">ARKit</Badge>}
            {arCapabilities.arcore && <Badge variant="outline">ARCore</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AR Controls */}
        <div className="space-y-4">
          {/* Finish Selection */}
          {availableFinishes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Finish</label>
              <div className="flex flex-wrap gap-2">
                {availableFinishes.map((finish) => (
                  <Button
                    key={finish}
                    variant={selectedFinish === finish ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFinishChange(finish)}
                    className="text-xs"
                  >
                    {finish}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Scale Control */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Scale: {scale[0].toFixed(1)}x
            </label>
            <Slider
              value={scale}
              onValueChange={setScale}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rotation: {rotation[0]}°
            </label>
            <Slider
              value={rotation}
              onValueChange={setRotation}
              min={0}
              max={360}
              step={15}
              className="w-full"
            />
          </div>
        </div>

        {/* Product Dimensions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Dimensions</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-lg">{dimensions.width}"</div>
              <div className="text-gray-600">Width</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-lg">{dimensions.height}"</div>
              <div className="text-gray-600">Height</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-lg">{dimensions.depth}"</div>
              <div className="text-gray-600">Depth</div>
            </div>
          </div>
        </div>

        {/* AR Action Buttons */}
        <div className="flex gap-2">
          {!isARActive ? (
            <Button
              onClick={startARSession}
              className="flex-1 flex items-center gap-2"
              size="lg"
            >
              <Smartphone className="w-4 h-4" />
              View in AR
            </Button>
          ) : (
            <Button
              onClick={stopARSession}
              variant="destructive"
              className="flex-1 flex items-center gap-2"
              size="lg"
            >
              <X className="w-4 h-4" />
              Exit AR
            </Button>
          )}

          <Button
            onClick={resetView}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* AR Instructions */}
        {!isARActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">AR Preview Instructions:</p>
                <ol className="space-y-1 text-xs">
                  <li>1. Tap "View in AR" to start the AR session</li>
                  <li>2. Point your camera at a flat surface</li>
                  <li>3. Tap to place the door in your space</li>
                  <li>4. Walk around to see it from all angles</li>
                  <li>5. Use pinch gestures to resize if needed</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* 3D Fallback Preview */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Move3D className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">3D Model Preview</p>
              <p className="text-xs text-gray-400 mt-1">
                Interactive preview will load here
              </p>
            </div>
          </div>

          {/* 3D Model Container */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              transform: `scale(${scale[0]}) rotate(${rotation[0]}deg)`,
              transition: 'transform 0.2s ease'
            }}
          />
        </div>

        {/* Feature List */}
        <div className="space-y-2">
          <h4 className="font-medium">AR Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              True-to-scale visualization
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              Multiple finish options
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              Room context placement
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              360° viewing capability
            </li>
          </ul>
        </div>
      </CardContent>

      {/* AR Session Overlay */}
      <AnimatePresence>
        {isARActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />

            {/* AR UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
                <div className="bg-black/70 text-white px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium">{productName}</p>
                  <p className="text-xs opacity-80">Tap to place</p>
                </div>

                <Button
                  onClick={stopARSession}
                  variant="ghost"
                  size="sm"
                  className="bg-black/70 text-white hover:bg-black/80"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* AR Placement Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-2 border-white border-opacity-80 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}