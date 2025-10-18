"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoHeroProps {
  videoSources: {
    webm?: string
    mp4: string
  }
  posterImage: string
  alt?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  overlay?: boolean
  overlayOpacity?: number
  className?: string
  children?: React.ReactNode
}

export function VideoHero({
  videoSources,
  posterImage,
  alt = "Video background",
  autoplay = true,
  loop = true,
  muted = true,
  controls = true,
  overlay = true,
  overlayOpacity = 0.5,
  className = "",
  children,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(!autoplay)

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handleCanPlay = () => {
      setIsLoaded(true)
      if (autoplay) {
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              setShowPlayButton(false)
            })
            .catch(() => {
              // Autoplay was prevented
              setShowPlayButton(true)
            })
        }
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [autoplay])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
      setShowPlayButton(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(!isMuted)
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => controls && setShowControls(true)}
      onMouseLeave={() => controls && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        poster={posterImage}
        className={`h-full w-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        aria-label={alt}
      >
        {videoSources.webm && (
          <source src={videoSources.webm} type="video/webm" />
        )}
        <source src={videoSources.mp4} type="video/mp4" />
      </video>

      {/* Poster Image (loading state) */}
      {!isLoaded && (
        <div className="absolute inset-0">
          <Image
            src={posterImage}
            alt={alt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
      )}

      {/* Overlay Gradient */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Play Button (for autoplay failures) */}
      {showPlayButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center"
          aria-label="Play video"
        >
          <div className="group cursor-pointer">
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/20 backdrop-blur-md" />
            <div className="relative rounded-full bg-white/30 p-8 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/40">
              <Play className="h-16 w-16 text-white" fill="white" />
            </div>
          </div>
        </motion.button>
      )}

      {/* Video Controls */}
      {controls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute bottom-6 right-6 z-30 flex gap-2"
        >
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="rounded-full bg-black/50 p-3 backdrop-blur-sm transition-all hover:bg-black/70"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="rounded-full bg-black/50 p-3 backdrop-blur-sm transition-all hover:bg-black/70"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        </motion.div>
      )}

      {/* Content Overlay */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
