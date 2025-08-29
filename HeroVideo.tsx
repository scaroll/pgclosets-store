"use client"

import { useState, useEffect, useRef } from "react"

export default function HeroVideo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      console.log("[v0] Video loaded successfully")
    }

    const handleError = () => {
      setHasError(true)
      console.log("[v0] Video failed to load")
    }

    const handleCanPlay = () => {
      console.log("[v0] Video ready to play")
      video.play().catch((error) => {
        console.log("[v0] Autoplay prevented:", error)
      })
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
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
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        preload="auto"
        poster="/renin-closet-doors-thumbnail.png"
        onLoadStart={() => console.log("[v0] Video loading started")}
        style={{ willChange: "opacity" }}
        fetchPriority="high"
        aria-label="Hero video showcasing premium Renin closet doors and professional installation"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
          type="video/mp4"
        />
        <track kind="captions" src="/captions.vtt" srcLang="en" label="English" />
      </video>

      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
      )}
    </>
  )
}
