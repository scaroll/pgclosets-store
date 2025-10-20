"use client"

import { useState, useEffect, useRef } from "react"

export default function HeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Start loading immediately
    video.load()

    const handleLoadedData = () => {
      setIsLoaded(true)
      console.log("Hero video loaded successfully")
    }

    const handleError = (e: Event) => {
      setHasError(true)
      console.error("Hero video failed to load:", e)
    }

    const handleCanPlay = () => {
      console.log("Hero video ready to play")
      // Try to play with better error handling
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            console.log("Hero video playing")
          })
          .catch((error) => {
            console.log("Autoplay prevented, showing play button:", error)
            // Video will show with poster image
          })
      }
    }

    const handlePlaying = () => {
      setIsPlaying(true)
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("playing", handlePlaying)

    // Also try to play on user interaction
    const handleUserInteraction = () => {
      if (video && !isPlaying) {
        video.play().catch(() => {})
      }
    }

    document.addEventListener("click", handleUserInteraction, { once: true })
    document.addEventListener("touchstart", handleUserInteraction, { once: true })

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("playing", handlePlaying)
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [])

  // Show poster image on error or as fallback
  if (hasError) {
    return (
      <div className="absolute inset-0">
        <img
          src="/renin-closet-doors-thumbnail.png"
          alt="Premium Renin closet doors showcase"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
      </div>
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        preload="metadata"
        poster="/renin-closet-doors-thumbnail.png"
        onLoadStart={() => console.log("Video loading started")}
        onLoadedMetadata={() => console.log("Video metadata loaded")}
        style={{ willChange: "opacity" }}
        aria-label="Hero video showcasing premium Renin closet doors and professional installation"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
          type="video/mp4"
        />
        {/* Fallback message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>

      {/* Show poster while loading */}
      {!isLoaded && (
        <div className="absolute inset-0">
          <img
            src="/renin-closet-doors-thumbnail.png"
            alt="Premium Renin closet doors showcase"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 animate-pulse">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Play button overlay if autoplay fails */}
      {isLoaded && !isPlaying && (
        <button
          onClick={() => {
            const video = videoRef.current
            if (video) {
              void video.play().then(() => setIsPlaying(true))
            }
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group cursor-pointer"
          aria-label="Play video"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-colors">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </>
  )
}
