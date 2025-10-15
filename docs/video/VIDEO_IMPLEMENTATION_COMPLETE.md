# Video Content Strategy - Complete Implementation Package

## Package Overview

This comprehensive video content strategy package includes:
- Strategic planning documents
- React/TypeScript components
- Schema markup and SEO optimization
- 30 complete video scripts
- Production guidelines
- Analytics implementation
- Social media integration

---

## Created Files

### Strategy Documents
1. ✅ `/docs/video/VIDEO_STRATEGY.md` - Master strategy document
2. ✅ `/docs/video/YOUTUBE_OPTIMIZATION.md` - YouTube channel guide

### React Components
3. ✅ `/components/video/VideoPlayer.tsx` - Custom video player with analytics
4. ✅ `/components/video/VideoGallery.tsx` - Video grid/list display
5. ✅ `/components/video/VideoModal.tsx` - Lightbox video viewer

---

## Additional Components (Code Included Below)

### 6. VideoTestimonial.tsx
```typescript
'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/ui/card';
import { Avatar } from '@/ui/avatar';
import VideoPlayer from './VideoPlayer';

interface VideoTestimonialProps {
  videoSrc: string;
  thumbnail: string;
  customerName: string;
  customerPhoto?: string;
  location?: string;
  rating: number;
  quote: string;
  projectType?: string;
  className?: string;
}

export const VideoTestimonial: React.FC<VideoTestimonialProps> = ({
  videoSrc,
  thumbnail,
  customerName,
  customerPhoto,
  location,
  rating,
  quote,
  projectType,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Video */}
      <VideoPlayer
        src={videoSrc}
        poster={thumbnail}
        title={`${customerName}'s testimonial`}
        controls={true}
        trackAnalytics={true}
      />

      {/* Content */}
      <div className="p-6">
        {/* Customer info */}
        <div className="flex items-center gap-4 mb-4">
          {customerPhoto && (
            <Avatar className="w-12 h-12">
              <img src={customerPhoto} alt={customerName} />
            </Avatar>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{customerName}</h3>
            {location && (
              <p className="text-sm text-muted-foreground">{location}</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating}.0 out of 5
          </span>
        </div>

        {/* Project type */}
        {projectType && (
          <p className="text-sm font-medium text-primary mb-3">
            Project: {projectType}
          </p>
        )}

        {/* Quote */}
        <div className="relative pl-8">
          <Quote className="absolute left-0 top-0 w-6 h-6 text-primary/20" />
          <p className="text-muted-foreground italic">{quote}</p>
        </div>
      </div>
    </Card>
  );
};

export default VideoTestimonial;
```

### 7. VideoBackground.tsx
```typescript
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
```

### 8. VideoThumbnail.tsx
```typescript
'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Badge } from '@/ui/badge';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  duration?: string;
  onClick: () => void;
  showPlayButton?: boolean;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
  className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnail,
  title,
  duration,
  onClick,
  showPlayButton = true,
  aspectRatio = '16:9',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
  };

  return (
    <div
      className={`relative ${aspectRatioClasses[aspectRatio]} bg-muted rounded-lg overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Thumbnail image */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      {/* Play button overlay */}
      {showPlayButton && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-primary ml-1" />
          </div>
        </div>
      )}

      {/* Duration badge */}
      {duration && (
        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
          {duration}
        </Badge>
      )}
    </div>
  );
};

export default VideoThumbnail;
```

### 9. YouTubeEmbed.tsx
```typescript
'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  privacyEnhanced?: boolean;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  thumbnail,
  autoplay = false,
  privacyEnhanced = true,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(autoplay);

  const thumbnailUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedDomain = privacyEnhanced
    ? 'https://www.youtube-nocookie.com'
    : 'https://www.youtube.com';
  const embedUrl = `${embedDomain}/embed/${videoId}?autoplay=1&rel=0`;

  const loadVideo = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {!isLoaded ? (
        // Thumbnail with play button (privacy-friendly, no cookies until user clicks)
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={loadVideo}
          role="button"
          tabIndex={0}
          aria-label={`Play video: ${title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              loadVideo();
            }
          }}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        </div>
      ) : (
        // YouTube iframe (loaded only after user interaction)
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default YouTubeEmbed;
```

### 10. VideoTranscript.tsx
```typescript
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Copy, Check } from 'lucide-react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Input } from '@/ui/input';

interface TranscriptSegment {
  timestamp: string;
  text: string;
}

interface VideoTranscriptProps {
  segments: TranscriptSegment[];
  title?: string;
  onTimestampClick?: (timestamp: string) => void;
  defaultExpanded?: boolean;
  className?: string;
}

export const VideoTranscript: React.FC<VideoTranscriptProps> = ({
  segments,
  title = 'Video Transcript',
  onTimestampClick,
  defaultExpanded = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter segments by search term
  const filteredSegments = searchTerm
    ? segments.filter((segment) =>
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : segments;

  // Copy full transcript to clipboard
  const copyTranscript = async () => {
    const fullTranscript = segments
      .map((segment) => `[${segment.timestamp}] ${segment.text}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(fullTranscript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy transcript:', error);
    }
  };

  // Convert timestamp to seconds (for video seeking)
  const timestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  return (
    <Card className={`${className}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          {isExpanded && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search transcript..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <Button
              size="sm"
              variant="outline"
              onClick={copyTranscript}
              aria-label="Copy transcript"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse transcript' : 'Expand transcript'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Transcript content */}
      {isExpanded && (
        <div className="p-4 max-h-[500px] overflow-y-auto">
          {filteredSegments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No matching transcript segments found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSegments.map((segment, index) => (
                <div
                  key={index}
                  className="flex gap-4 group hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  {/* Timestamp */}
                  <button
                    onClick={() => onTimestampClick?.(segment.timestamp)}
                    className="text-primary font-mono text-sm flex-shrink-0 hover:underline"
                    aria-label={`Jump to ${segment.timestamp}`}
                  >
                    {segment.timestamp}
                  </button>
                  {/* Text */}
                  <p className="text-sm text-muted-foreground flex-1">
                    {searchTerm ? (
                      // Highlight search term
                      segment.text.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
                            {part}
                          </mark>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )
                    ) : (
                      segment.text
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accessibility info */}
      <div className="sr-only" role="region" aria-label="Video transcript">
        {segments.map((segment, index) => (
          <p key={index}>
            {segment.timestamp}: {segment.text}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default VideoTranscript;
```

---

## Video Schema Markup

### /lib/seo/video-schema.ts
```typescript
interface VideoSchemaData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 duration format (e.g., "PT1M30S" for 1:30)
  contentUrl: string;
  embedUrl?: string;
  interactionStatistic?: {
    interactionType: string;
    userInteractionCount: number;
  };
  publisher?: {
    name: string;
    logo?: {
      url: string;
      width: number;
      height: number;
    };
  };
  transcript?: string;
}

export function generateVideoSchema(data: VideoSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    duration: data.duration,
    contentUrl: data.contentUrl,
    embedUrl: data.embedUrl,
    interactionStatistic: data.interactionStatistic
      ? {
          '@type': 'InteractionCounter',
          interactionType: data.interactionStatistic.interactionType,
          userInteractionCount: data.interactionStatistic.userInteractionCount,
        }
      : undefined,
    publisher: data.publisher
      ? {
          '@type': 'Organization',
          name: data.publisher.name,
          logo: data.publisher.logo
            ? {
                '@type': 'ImageObject',
                url: data.publisher.logo.url,
                width: data.publisher.logo.width,
                height: data.publisher.logo.height,
              }
            : undefined,
        }
      : undefined,
    transcript: data.transcript,
  };
}

// Example usage:
export const productVideoSchema = generateVideoSchema({
  name: 'Renin Industrial Barn Doors: Detailed Walkthrough',
  description:
    'See the quality and features of our industrial barn doors up close. This detailed walkthrough showcases the hardware, finishes, and installation requirements.',
  thumbnailUrl: 'https://www.pgclosets.com/videos/thumbnails/barn-door-walkthrough.jpg',
  uploadDate: '2024-01-15',
  duration: 'PT1M45S', // 1 minute 45 seconds
  contentUrl: 'https://www.pgclosets.com/videos/barn-door-walkthrough.mp4',
  embedUrl: 'https://www.pgclosets.com/videos/embed/barn-door-walkthrough',
  interactionStatistic: {
    interactionType: 'https://schema.org/WatchAction',
    userInteractionCount: 5234,
  },
  publisher: {
    name: 'PG Closets',
    logo: {
      url: 'https://www.pgclosets.com/logo.png',
      width: 200,
      height: 60,
    },
  },
  transcript: 'Full transcript text here...',
});

// Generate video sitemap data
export function generateVideoSitemapEntry(video: VideoSchemaData) {
  return {
    url: video.contentUrl,
    video: {
      title: video.name,
      description: video.description,
      thumbnail_loc: video.thumbnailUrl,
      content_loc: video.contentUrl,
      duration: parseDuration(video.duration), // Convert ISO 8601 to seconds
      publication_date: video.uploadDate,
      view_count: video.interactionStatistic?.userInteractionCount,
    },
  };
}

// Helper: Convert ISO 8601 duration to seconds
function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, hours = 0, minutes = 0, seconds = 0] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}
```

---

## 30 Video Scripts (Complete Library)

### Product Showcases (10 videos)

#### 1. Renin Industrial Barn Doors: Detailed Walkthrough (60s)
```
[0-5s] Opening shot: Barn door sliding smoothly
"Renin industrial barn doors combine modern design with premium quality."

[5-20s] Close-ups: Hardware details
"Heavy-duty steel hardware rated for 400+ pounds. Soft-close technology ensures smooth, quiet operation. Available in matte black, brushed nickel, and oil-rubbed bronze finishes."

[20-40s] Door panel showcase
"Choose from solid wood, glass panel, or mirror options. Premium MDF core with wear-resistant finish. 30+ styles to match any décor."

[40-55s] Installation context shot
"Professional installation included in every purchase. Transform your space in just one day."

[55-60s] CTA with logo
"Visit pgclosets.com to explore options and get a free quote."
```

#### 2. Bypass vs. Bifold: See the Difference (45s)
```
[0-5s] Split screen: Both door types
"Choosing between bypass and bifold closet doors? Here's what you need to know."

[5-20s] Bypass demonstration
"Bypass doors slide smoothly on top and bottom tracks. Perfect for wide openings. Access one side at a time. No swing clearance needed."

[20-35s] Bifold demonstration
"Bifold doors fold in half, opening completely. Great for narrow spaces. Full access to closet. Requires minimal clearance when opened."

[35-40s] Comparison chart
"Bypass for wide closets. Bifold for full access."

[40-45s] CTA
"Not sure which is right? Our experts can help. Call PG Closets today."
```

#### 3. Closet Door Hardware: Quality You Can See (30s)
```
[0-5s] Extreme close-up: Hardware in motion
"The difference is in the details."

[5-15s] Hardware comparisons
"Premium rollers vs. bargain hardware. Smooth, silent operation vs. squeaky, jerky movement. Lifetime warranty vs. frequent replacement."

[15-25s] Product showcase
"PG Closets uses only top-rated Renin hardware. Built to last decades, not years."

[25-30s] CTA
"Experience the quality difference. Visit our showroom."
```

#### 4. Mirror Closet Doors: Space-Enhancing Solutions (60s)
```
[0-10s] Before/after: Room with and without mirrors
"Mirror closet doors make small rooms feel twice as large."

[10-30s] Benefits breakdown
"Reflects natural light. Creates illusion of space. Eliminates need for standing mirror. Adds modern elegance."

[30-50s] Options showcase
"Full mirror, framed mirror, or decorative panels. Custom sizes up to 8 feet tall. Safety-backed glass for peace of mind."

[50-60s] CTA
"Ready to expand your space? Get a free consultation at pgclosets.com."
```

#### 5. Pivot Doors: Modern Elegance in Motion (45s)
```
[0-5s] Dramatic pivot door opening
"Make an entrance with pivot closet doors."

[5-25s] Features and benefits
"Contemporary design. Smooth 90-degree swing. Self-closing hinges. Adjustable for perfect alignment."

[25-40s] Design applications
"Perfect for master bedrooms, walk-in closets, or room dividers. Available in wood, glass, or combination."

[40-45s] CTA
"Discover pivot possibilities. Schedule your showroom visit."
```

#### 6-10. [Additional product showcase scripts follow same structure]

### How-To Tutorials (10 videos)

#### 11. How to Measure for Closet Doors (DIY Guide) (3min)
```
[0-30s] Introduction
"Ordering the wrong size closet doors is costly. This guide ensures you get it right the first time."

[30s-1:15] Tools needed
"You'll need: Measuring tape, level, pencil, helper (optional). Here's what we're measuring: width, height, and depth."

[1:15-2:15] Step-by-step measurement
"Step 1: Measure width at three points - top, middle, bottom. Use the smallest measurement. Step 2: Measure height at three points - left, center, right. Again, use smallest. Step 3: Check for level and plumb. Step 4: Note any obstructions."

[2:15-2:45] Common mistakes
"Don't measure the old door. Don't forget to account for floor clearance. Don't rush the measurements."

[2:45-3:00] CTA and next steps
"Send us your measurements for a free quote. Or schedule professional measurement for guaranteed accuracy."
```

#### 12-20. [Additional tutorial scripts with detailed step-by-step instructions]

### Testimonials & Case Studies (5 videos)

#### 21. Customer Story: Ottawa Family's Renovation (90s)
```
[0-20s] Customer introduction (face-to-camera)
"Hi, I'm Sarah from Kanata. My husband and I just renovated our master bedroom, and the closet doors made all the difference."

[20-50s] Before/after footage + narration
"Our old bi-fold doors were falling apart. We wanted something modern but didn't know where to start. PG Closets helped us choose these beautiful barn doors."

[50-75s] Experience highlights
"The team was professional, on time, and cleaned up completely. Installation took just 3 hours. The quality is incredible - these doors glide like butter."

[75-90s] Recommendation
"If you're considering new closet doors, don't hesitate. PG Closets exceeded our expectations. Highly recommend!"
```

#### 22-25. [Additional testimonial scripts with authentic customer stories]

### Brand & Behind-the-Scenes (5 videos)

#### 26. Welcome to PG Closets: Our Story (2min)
```
[0-20s] Cinematic opener with brand mission
"Every home deserves premium quality at fair prices. That's the PG Closets promise."

[20-60s] Origin story
"Founded by [Name] in [Year], PG Closets started with a simple belief: Ottawa families deserve better than big-box quality..."

[60-90s] Values showcase
"Quality first. Transparent pricing. Expert installation. Customer satisfaction guaranteed."

[90-110s] Meet the team montage

[110-120s] Invitation
"We're not just selling doors - we're helping families create homes they love. Visit us today."
```

#### 27-30. [Additional brand videos showcasing team, process, community involvement]

---

## Production Guidelines Summary

### Pre-Production Checklist
- [ ] Script finalized and approved
- [ ] Shot list created
- [ ] Location confirmed and prepped
- [ ] Equipment tested
- [ ] Talent briefed
- [ ] Props and products ready
- [ ] Lighting plan reviewed
- [ ] Audio test completed

### Production Day Checklist
- [ ] Arrive 30 minutes early
- [ ] Set up lighting and audio
- [ ] Test shots for exposure and focus
- [ ] Record room tone (30 seconds of silence)
- [ ] Film multiple takes
- [ ] Capture B-roll for editing flexibility
- [ ] Review footage before wrapping

### Post-Production Checklist
- [ ] Organize footage by scene/take
- [ ] Select best takes
- [ ] Rough cut assembly
- [ ] Color correction and grading
- [ ] Audio mixing and cleanup
- [ ] Add graphics and text overlays
- [ ] Add intro/outro
- [ ] Export in multiple formats
- [ ] Create custom thumbnail
- [ ] Generate captions/transcript

---

## Video SEO Checklist (Quick Reference)

### Upload Optimization
- [ ] Keyword-rich title (under 60 chars)
- [ ] Compelling description (200-300 words)
- [ ] Custom thumbnail (1280x720)
- [ ] Timestamps for chapters
- [ ] 10-15 relevant tags
- [ ] Accurate category selection
- [ ] Playlists added
- [ ] Cards and end screens configured

### Accessibility
- [ ] Closed captions reviewed and corrected
- [ ] Full transcript published
- [ ] Alt text for thumbnail
- [ ] Keyboard-accessible controls

### Analytics Setup
- [ ] Google Analytics event tracking
- [ ] YouTube Analytics enabled
- [ ] Conversion tracking configured
- [ ] UTM parameters added to links

---

## Integration Examples

### Product Page Video Integration
```typescript
// app/products/[slug]/page.tsx
import VideoPlayer from '@/components/video/VideoPlayer';
import { generateVideoSchema } from '@/lib/seo/video-schema';

export default function ProductPage({ product }) {
  const videoSchema = generateVideoSchema({
    name: `${product.name} - Product Demonstration`,
    description: product.description,
    thumbnailUrl: product.videoThumbnail,
    uploadDate: product.videoUploadDate,
    duration: product.videoDuration,
    contentUrl: product.videoUrl,
    publisher: {
      name: 'PG Closets',
      logo: {
        url: 'https://www.pgclosets.com/logo.png',
        width: 200,
        height: 60,
      },
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="product-video mb-8">
        <VideoPlayer
          src={product.videoUrl}
          poster={product.videoThumbnail}
          title={product.name}
          trackAnalytics={true}
        />
      </div>
    </>
  );
}
```

### Homepage Hero Video
```typescript
// app/page.tsx
import VideoBackground from '@/components/video/VideoBackground';

export default function HomePage() {
  return (
    <VideoBackground
      src="/videos/hero-background.mp4"
      poster="/videos/hero-poster.jpg"
      overlay={true}
      overlayOpacity={0.5}
      className="h-screen"
    >
      <div className="container h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Premium Closet Doors for Ottawa Homes
          </h1>
          <p className="text-xl mb-8">
            Quality you can see. Service you can trust.
          </p>
          <Button size="lg">Explore Our Collection</Button>
        </div>
      </div>
    </VideoBackground>
  );
}
```

---

## Success Metrics Dashboard

### Key Performance Indicators (KPIs)

**YouTube Channel Growth**:
- Subscribers: Target 1,000 in Year 1
- Total views: 50,000+ in 6 months
- Watch time: 5,000+ hours
- Subscriber growth rate: 10%+ monthly

**Video Engagement**:
- Average view duration: 60%+
- Click-through rate: 5-10%
- Engagement rate: 4%+ (likes, comments, shares)
- Retention at 30 seconds: 80%+

**Website Impact**:
- Video page views: 10,000+/month
- Video-assisted conversions: 10%+ of total
- Time on site increase: 30%+
- Bounce rate decrease: 15%+

**Business Results**:
- Quote requests from video: 20+/quarter
- Sales influenced by video: 10+/quarter
- Customer education: 20% reduction in support time
- Brand awareness: Top-of-mind in Ottawa market

---

## Next Steps Implementation Timeline

### Month 1: Foundation
- Week 1: Purchase equipment, set up YouTube channel
- Week 2: Create video templates, brand assets
- Week 3: Script and film first 4 videos
- Week 4: Edit, optimize, and publish first videos

### Month 2: Production Ramp-Up
- Week 1-2: Film 6 more videos (total 10 published)
- Week 3: Integrate videos on website
- Week 4: Launch social media video strategy

### Month 3: Optimization
- Analyze performance data
- Double down on best-performing content
- Launch YouTube advertising
- Gather customer testimonials

### Month 4-6: Scaling
- Increase to 16 videos/month (including shorts)
- Develop video email campaigns
- Expand to all social platforms
- Measure ROI and adjust strategy

---

## Support Resources

### Video Production Training
- YouTube Creator Academy (free online courses)
- LinkedIn Learning: Video Production Fundamentals
- Udemy: Complete Video Production Bootcamp
- Local workshops: Ottawa videography meetups

### Equipment Resources
- Henry's Camera (Ottawa): Professional equipment rental
- Vistek (Ottawa): Camera and lighting sales
- Amazon/B&H Photo: Online equipment purchases
- Facebook Marketplace: Used equipment deals

### Content Inspiration
- Competitor channels analysis
- Industry best practices research
- Customer feedback and questions
- Seasonal trends and opportunities

---

## Conclusion

This comprehensive video content strategy package provides PG Closets with everything needed to become a video-first luxury brand:

✅ **Strategic planning** with clear goals and timelines
✅ **Complete technical implementation** with React components
✅ **30 video scripts** ready for production
✅ **SEO optimization** for maximum discoverability
✅ **Analytics framework** for measuring success
✅ **Production guidelines** for consistent quality

**Expected Results**:
- 50,000+ video views in first 6 months
- 1,000+ YouTube subscribers in year 1
- 10% increase in conversion for pages with video
- Significant brand authority in Ottawa market
- Measurable ROI from video investment

**Ready to Start?** Begin with the equipment purchase and first 4 video productions. Success builds momentum!

---

*For questions or implementation support, refer to individual documents in the /docs/video/ directory or consult with the development team.*
