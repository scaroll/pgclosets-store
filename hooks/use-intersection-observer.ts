'use client'

import { useState, useEffect, RefObject } from 'react'

interface UseIntersectionObserverProps {
  target: RefObject<Element>
  root?: RefObject<Element>
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

interface UseIntersectionObserverReturn {
  isIntersecting: boolean
  entry: IntersectionObserverEntry | null
}

export function useIntersectionObserver({
  target,
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false
}: UseIntersectionObserverProps): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const targetElement = target?.current
    if (!targetElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
        
        if (entry.isIntersecting && once) {
          observer.unobserve(targetElement)
        }
      },
      {
        root: root?.current,
        rootMargin,
        threshold
      }
    )

    observer.observe(targetElement)

    return () => {
      observer.unobserve(targetElement)
    }
  }, [target, root, rootMargin, threshold, once])

  return { isIntersecting, entry }
}

// Hook for lazy loading with visibility tracking
export function useLazyLoading(options?: {
  rootMargin?: string
  threshold?: number
  once?: boolean
}) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsVisible(isIntersecting)
        
        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true)
          
          if (options?.once) {
            observer.unobserve(ref)
          }
        }
      },
      {
        rootMargin: options?.rootMargin || '50px',
        threshold: options?.threshold || 0.1
      }
    )

    observer.observe(ref)

    return () => {
      observer.unobserve(ref)
    }
  }, [ref, hasBeenVisible, options])

  return { 
    ref: setRef, 
    isVisible, 
    hasBeenVisible,
    shouldLoad: hasBeenVisible || isVisible
  }
}

// Hook for performance-optimized image loading
export function useImagePreloader(imageSrcs: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src))
          resolve()
        }
        
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(src))
          reject(new Error(`Failed to load image: ${src}`))
        }
        
        img.src = src
      })
    }

    const preloadPromises = imageSrcs.map(src => 
      preloadImage(src).catch(error => {
        console.warn('Image preload failed:', error)
      })
    )

    Promise.allSettled(preloadPromises)

    return () => {
      // Cleanup: cancel any pending image loads
      imageSrcs.forEach(src => {
        const imgs = document.querySelectorAll(`img[src="${src}"]`)
        imgs.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.onload = null
            img.onerror = null
          }
        })
      })
    }
  }, [imageSrcs])

  return {
    loadedImages,
    failedImages,
    isImageLoaded: (src: string) => loadedImages.has(src),
    isImageFailed: (src: string) => failedImages.has(src),
    preloadProgress: loadedImages.size / imageSrcs.length
  }
}