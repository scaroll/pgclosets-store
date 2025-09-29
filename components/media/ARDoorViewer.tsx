"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface ARModel {
  id: string
  productId: string
  modelUrl: string // GLB/GLTF file URL
  thumbnailUrl: string
  scale: { x: number; y: number; z: number }
  defaultPosition: { x: number; y: number; z: number }
  materials: ARMaterial[]
}

interface ARMaterial {
  id: string
  name: string
  textureUrl: string
  normalMapUrl?: string
  roughnessMapUrl?: string
  metallicMapUrl?: string
  color: string
}

interface ARDoorViewerProps {
  product: {
    id: string
    name: string
    category: string
  }
  arModel: ARModel
  onClose?: () => void
  className?: string
}

interface ARSession {
  isActive: boolean
  isSupported: boolean
  error?: string
  mode: 'initializing' | 'scanning' | 'tracking' | 'placed'
}

export function ARDoorViewer({ product, arModel, onClose, className }: ARDoorViewerProps) {
  const [arSession, setARSession] = useState<ARSession>({
    isActive: false,
    isSupported: false,
    mode: 'initializing'
  })
  const [selectedMaterial, setSelectedMaterial] = useState<ARMaterial>(arModel.materials[0])
  const [modelScale, setModelScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const arCanvasRef = useRef<HTMLCanvasElement>(null)
  const arSessionRef = useRef<any>(null)

  // Check WebXR support
  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const isARSupported = await (navigator as any).xr.isSessionSupported('immersive-ar')
          setARSession(prev => ({ ...prev, isSupported: isARSupported }))
        } catch (error) {
          console.warn('AR not supported:', error)
          setARSession(prev => ({ ...prev, isSupported: false }))
        }
      } else {
        // Fallback to model-viewer for non-AR devices
        setARSession(prev => ({ ...prev, isSupported: true }))
      }
    }

    checkARSupport()
  }, [])

  const startARSession = async () => {
    if (!arSession.isSupported) {
      setARSession(prev => ({ ...prev, error: 'AR not supported on this device' }))
      return
    }

    setIsLoading(true)
    setShowInstructions(true)

    try {
      if ('xr' in navigator) {
        // Native WebXR implementation
        const session = await (navigator as any).xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'dom-overlay'],
          domOverlay: { root: document.body }
        })

        arSessionRef.current = session
        setARSession(prev => ({ ...prev, isActive: true, mode: 'scanning' }))

        // Initialize WebXR session
        await initializeWebXRSession(session)
      } else {
        // Fallback to model-viewer
        setARSession(prev => ({ ...prev, isActive: true, mode: 'placed' }))
      }
    } catch (error) {
      console.error('Failed to start AR session:', error)
      setARSession(prev => ({ ...prev, error: 'Failed to start AR session' }))
    } finally {
      setIsLoading(false)
    }
  }

  const initializeWebXRSession = async (session: any) => {
    // This would contain the actual WebXR implementation
    // For now, we'll simulate the AR experience
    setTimeout(() => {
      setARSession(prev => ({ ...prev, mode: 'tracking' }))
    }, 2000)

    setTimeout(() => {
      setARSession(prev => ({ ...prev, mode: 'placed' }))
      setShowInstructions(false)
    }, 4000)
  }

  const stopARSession = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end()
      arSessionRef.current = null
    }

    setARSession({
      isActive: false,
      isSupported: arSession.isSupported,
      mode: 'initializing'
    })
    setShowInstructions(true)
    onClose?.()
  }

  const changeMaterial = (material: ARMaterial) => {
    setSelectedMaterial(material)
    // In a real implementation, this would update the 3D model's material
  }

  const adjustScale = (scale: number) => {
    setModelScale(scale)
    // In a real implementation, this would update the 3D model's scale
  }

  const ARInstructions = () => (
    <AnimatePresence>
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              {arSession.mode === 'scanning' && "Point your camera at the floor and move slowly to detect surfaces"}
              {arSession.mode === 'tracking' && "Tap on a detected surface to place your door"}
              {arSession.mode === 'placed' && "Door placed! Use controls below to adjust size and material"}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const MaterialSelector = () => (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {arModel.materials.map((material) => (
        <button
          key={material.id}
          onClick={() => changeMaterial(material)}
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all",
            selectedMaterial.id === material.id
              ? "border-primary ring-2 ring-primary/20"
              : "border-muted hover:border-muted-foreground/20"
          )}
          style={{ backgroundColor: material.color }}
          title={material.name}
        >
          <span className="sr-only">{material.name}</span>
        </button>
      ))}
    </div>
  )

  const ARControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-4 z-10"
    >
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Material selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Material</label>
            <MaterialSelector />
            <p className="text-xs text-muted-foreground mt-1">{selectedMaterial.name}</p>
          </div>

          {/* Scale adjustment */}
          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustScale(Math.max(0.5, modelScale - 0.1))}
                disabled={modelScale <= 0.5}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[3rem] text-center">
                {Math.round(modelScale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustScale(Math.min(2.0, modelScale + 0.1))}
                disabled={modelScale >= 2.0}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <InfoIcon className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // TODO: Implement screenshot functionality
              }}
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Photo
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={stopARSession}
            >
              <XIcon className="w-4 h-4 mr-2" />
              Exit AR
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const FallbackViewer = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-muted/50 to-muted">
      {/* This would contain a model-viewer component or Three.js scene */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <CubeIcon className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-muted-foreground">3D Model Preview</p>
          </div>
          <div className="space-y-2">
            <MaterialSelector />
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustScale(Math.max(0.5, modelScale - 0.1))}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[3rem]">{Math.round(modelScale * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustScale(Math.min(2.0, modelScale + 0.1))}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!arSession.isSupported && !arSession.isActive) {
    return (
      <div className={cn("space-y-4", className)}>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            AR is not supported on this device. You can still view the 3D model below.
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="p-0 aspect-square">
            <FallbackViewer />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {!arSession.isActive ? (
        // AR Launch Screen
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ARIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">View in Your Space</h3>
              <p className="text-muted-foreground">
                See how the {product.name} looks in your room using augmented reality
              </p>
            </div>

            {arSession.error && (
              <Alert variant="destructive">
                <AlertDescription>{arSession.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                onClick={startARSession}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <LoadingIcon className="w-4 h-4 mr-2 animate-spin" />
                    Starting AR...
                  </>
                ) : (
                  <>
                    <ARIcon className="w-4 h-4 mr-2" />
                    Start AR Experience
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setARSession(prev => ({ ...prev, isActive: true, mode: 'placed' }))
                }}
                className="w-full"
              >
                <CubeIcon className="w-4 h-4 mr-2" />
                View 3D Model
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Requirements:</p>
              <ul className="space-y-0.5">
                <li>• Modern smartphone or tablet</li>
                <li>• Good lighting conditions</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        // AR Session Active
        <div className="relative w-full h-screen bg-black">
          <canvas
            ref={arCanvasRef}
            className="w-full h-full"
            style={{ display: arSession.mode !== 'placed' ? 'block' : 'none' }}
          />

          {arSession.mode === 'placed' && <FallbackViewer />}

          <ARInstructions />

          {arSession.mode === 'placed' && <ARControls />}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <LoadingIcon className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading 3D model...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Icon components
const ARIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const CubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LoadingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)