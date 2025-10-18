'use client';

import React, { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  overlay = true,
  overlayOpacity = 0.5,
  className = '',
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays (some browsers block autoplay)
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Video autoplay failed:', error);
        }
      }
    };
    playVideo();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default VideoBackground;
