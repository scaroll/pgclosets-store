"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Heart,
  Eye,
  Star,
  Timer,
  Layers,
  Grid3X3,
  Camera,
  Settings,
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle
} from 'lucide-react'

interface BeforeAfterItem {
  id: string
  title: string
  description: string
  category: string
  beforeImage: string
  afterImage: string
  videoUrl?: string
  thumbnail: string
  tags: string[]
  likes: number
  views: number
  rating: number
  transformation: {
    duration: string
    budget: string
    challenge: string
    solution: string
    materials: string[]
  }
  photographer?: string
  location?: string
  date: Date
}

interface BeforeAfterGalleryProps {
  items: BeforeAfterItem[]
  enableAutoPlay?: boolean
  showSlider?: boolean
  enableVideo?: boolean
  allowFullscreen?: boolean
  enableZoom?: boolean
  showMetadata?: boolean
  autoplaySpeed?: number
  className?: string
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  items,
  enableAutoPlay = true,
  showSlider = true,
  enableVideo = true,
  allowFullscreen = true,
  enableZoom = true,
  showMetadata = true,
  autoplaySpeed = 3000,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState<'slider' | 'fade' | 'side-by-side'>('slider')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isGridMode, setIsGridMode] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const currentItem = items[currentIndex]

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && enableAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, autoplaySpeed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, enableAutoPlay, autoplaySpeed, items.length])

  // Handle slider drag
  const handleSliderMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleSliderMove(e)
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (e: MouseEvent) => handleSliderMove(e)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Navigate items
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3))
    } else if (direction === 'out') {
      setZoomLevel(prev => Math.max(prev - 0.25, 1))
    } else {
      setZoomLevel(1)
    }
  }

  // Share functionality
  const shareItem = async () => {
    const shareData = {
      title: currentItem.title,
      text: currentItem.description,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  // Render slider view
  const renderSliderView = () => (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] overflow-hidden rounded-lg bg-black"
      onMouseDown={handleSliderMouseDown}
      style={{ cursor: isDragging ? 'ew-resize' : 'default' }}
    >
      {/* Before Image */}
      <img
        src={currentItem.beforeImage}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center'
        }}
      />

      {/* After Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${sliderPosition}%`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center'
        }}
      >
        <img
          src={currentItem.afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: `translateX(${(100 - sliderPosition) * (zoomLevel - 1)}%)`
          }}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Move className="h-6 w-6 text-gray-600" />
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md">
            After
          </div>
        </>
      )}

      {/* Zoom indicator */}
      {zoomLevel > 1 && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  )

  // Render fade transition view
  const renderFadeView = () => (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-before`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
        >
          <img
            src={currentItem.beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
          />
          {showLabels && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md">
              Before
            </div>
          )}
        </motion.div>

        <motion.div
          key={`${currentIndex}-after`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
        >
          <img
            src={currentItem.afterImage}
            alt="After"
            className="w-full h-full object-cover"
          />
          {showLabels && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md">
              After
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  // Render side-by-side view
  const renderSideBySideView = () => (
    <div className="grid grid-cols-2 gap-4 w-full h-[600px]">
      <div className="relative overflow-hidden rounded-lg bg-black">
        <img
          src={currentItem.beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
        />
        {showLabels && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md">
            Before
          </div>
        )}
      </div>
      <div className="relative overflow-hidden rounded-lg bg-black">
        <img
          src={currentItem.afterImage}
          alt="After"
          className="w-full h-full object-cover"
        />
        {showLabels && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md">
            After
          </div>
        )}
      </div>
    </div>
  )

  // Render video view
  const renderVideoView = () => (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg bg-black">
      {currentItem.videoUrl ? (
        <video
          className="w-full h-full object-cover"
          controls
          muted={isMuted}
          autoPlay={isPlaying}
        >
          <source src={currentItem.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Video not available for this transformation</p>
          </div>
        </div>
      )}
    </div>
  )

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => {
            setCurrentIndex(index)
            setIsGridMode(false)
          }}
        >
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{item.views}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Transformations Gallery</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={isGridMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsGridMode(!isGridMode)}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
              >
                <Layers className="h-4 w-4 mr-2" />
                Labels
              </Button>
              {allowFullscreen && (
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Fullscreen className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      {isGridMode ? (
        renderGridView()
      ) : (
        <>
          {/* View Mode Selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'slider' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('slider')}
                  >
                    Slider
                  </Button>
                  <Button
                    variant={viewMode === 'fade' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('fade')}
                  >
                    Fade
                  </Button>
                  <Button
                    variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('side-by-side')}
                  >
                    Side by Side
                  </Button>
                  {enableVideo && currentItem.videoUrl && (
                    <Button
                      variant={viewMode === 'video' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('video')}
                    >
                      Video
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {enableZoom && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleZoom('reset')}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Viewer */}
          <Card>
            <CardContent className="pt-6">
              {viewMode === 'slider' && renderSliderView()}
              {viewMode === 'fade' && renderFadeView()}
              {viewMode === 'side-by-side' && renderSideBySideView()}
              {viewMode === 'video' && renderVideoView()}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={goToPrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {enableAutoPlay && (
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}

                  <div className="flex items-center gap-1">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-primary' : 'bg-muted'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {items.length}
                  </span>
                </div>

                <Button variant="outline" onClick={goToNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{currentItem.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{currentItem.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareItem}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showMetadata && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Duration
                    </h4>
                    <p className="text-sm text-muted-foreground">{currentItem.transformation.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Budget</h4>
                    <p className="text-sm text-muted-foreground">{currentItem.transformation.budget}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{currentItem.transformation.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Solution</h4>
                    <p className="text-sm text-muted-foreground">{currentItem.transformation.solution}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-medium mb-2">Materials Used</h4>
                <div className="flex flex-wrap gap-2">
                  {currentItem.transformation.materials.map((material, index) => (
                    <Badge key={index} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{currentItem.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{currentItem.likes + (isLiked ? 1 : 0)} likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{currentItem.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentItem.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default BeforeAfterGallery