'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Button } from '@/ui/button';
import { Slider } from '@/ui/slider';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  trackAnalytics?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  trackAnalytics = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Track video analytics
  useEffect(() => {
    if (!trackAnalytics || !videoRef.current) return;

    const video = videoRef.current;
    let analyticsEvents = {
      started: false,
      reached25: false,
      reached50: false,
      reached75: false,
      completed: false,
    };

    const trackEvent = (event: string, data?: any) => {
      // Send to analytics service (Google Analytics, PostHog, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, {
          event_category: 'Video',
          event_label: title || src,
          video_url: src,
          ...data,
        });
      }
    };

    const handleProgress = () => {
      const percentage = (video.currentTime / video.duration) * 100;

      if (percentage >= 25 && !analyticsEvents.reached25) {
        analyticsEvents.reached25 = true;
        trackEvent('video_progress', { progress: 25 });
      }
      if (percentage >= 50 && !analyticsEvents.reached50) {
        analyticsEvents.reached50 = true;
        trackEvent('video_progress', { progress: 50 });
      }
      if (percentage >= 75 && !analyticsEvents.reached75) {
        analyticsEvents.reached75 = true;
        trackEvent('video_progress', { progress: 75 });
      }
    };

    const handleStart = () => {
      if (!analyticsEvents.started) {
        analyticsEvents.started = true;
        trackEvent('video_start');
      }
    };

    const handleComplete = () => {
      if (!analyticsEvents.completed) {
        analyticsEvents.completed = true;
        trackEvent('video_complete', {
          watch_time: video.currentTime,
          completion_rate: (video.currentTime / video.duration) * 100,
        });
      }
    };

    video.addEventListener('play', handleStart);
    video.addEventListener('timeupdate', handleProgress);
    video.addEventListener('ended', handleComplete);

    return () => {
      video.removeEventListener('play', handleStart);
      video.removeEventListener('timeupdate', handleProgress);
      video.removeEventListener('ended', handleComplete);
    };
  }, [src, title, trackAnalytics]);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setWatchedPercentage((current / total) * 100);
      onTimeUpdate?.(current, total);
    }
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onPlay, onPause, onEnded]);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-contain"
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>

      {/* Play button overlay (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button
            size="lg"
            variant="default"
            className="rounded-full w-20 h-20 hover:scale-110 transition-transform"
            onClick={togglePlay}
            aria-label="Play video"
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Custom controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress bar */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
              aria-label="Video progress"
            />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/volume">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-200">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Time display */}
              <span className="text-sm text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Settings (optional) */}
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Fullscreen */}
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
                aria-label="Toggle fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility: Screen reader info */}
      {title && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Video: {title}. {isPlaying ? 'Playing' : 'Paused'}.
          {watchedPercentage > 0 && ` ${Math.round(watchedPercentage)}% watched.`}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
