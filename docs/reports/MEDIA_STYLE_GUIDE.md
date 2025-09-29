# Media Style Guide & Standards
## PG Closets Store Visual Identity System

### Brand Identity Foundation

#### Color Palette for Media Components
```css
:root {
  /* Primary Brand Colors */
  --pg-primary: #1a1a1a;          /* Deep charcoal - main brand */
  --pg-primary-light: #333333;     /* Light charcoal - hover states */
  --pg-secondary: #f8f9fa;         /* Light gray - backgrounds */
  --pg-accent: #007bff;            /* PG Blue - CTAs and highlights */

  /* Media UI Colors */
  --media-overlay: rgba(0, 0, 0, 0.75);    /* Video/image overlays */
  --media-control: rgba(255, 255, 255, 0.9); /* Control backgrounds */
  --media-highlight: #007bff;               /* Active states */
  --media-muted: #6c757d;                  /* Secondary text */

  /* Status Colors */
  --success: #28a745;              /* Success states */
  --warning: #ffc107;              /* Warning states */
  --error: #dc3545;                /* Error states */
  --info: #17a2b8;                 /* Information states */

  /* Interactive States */
  --hover-overlay: rgba(0, 123, 255, 0.1);
  --focus-ring: 0 0 0 2px rgba(0, 123, 255, 0.25);
  --active-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### Typography Scale
```css
/* Typography for Media Components */
.media-headline {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.media-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.media-body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0;
}

.media-caption {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: var(--media-muted);
}

.media-label {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Media Component Standards

#### Image Gallery Components

##### Primary Gallery Container
```css
.enhanced-gallery {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  background: white;
  border: 1px solid #e5e7eb;
}

.gallery-main-viewer {
  aspect-ratio: 4/3;
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
}

@media (max-width: 768px) {
  .gallery-main-viewer {
    aspect-ratio: 1/1;
  }
}
```

##### Thumbnail Strip
```css
.gallery-thumbnails {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.gallery-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.gallery-thumbnail:hover {
  border-color: var(--media-highlight);
  transform: translateY(-2px);
  box-shadow: var(--active-shadow);
}

.gallery-thumbnail.active {
  border-color: var(--media-highlight);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
```

##### Navigation Controls
```css
.gallery-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.gallery-control-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--media-control);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.gallery-control-button:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: var(--active-shadow);
}

.gallery-control-button:focus {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

#### AR Viewer Components

##### AR Launch Interface
```css
.ar-launcher {
  padding: 32px;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px dashed #dee2e6;
}

.ar-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  padding: 16px;
  background: var(--pg-accent);
  border-radius: 50%;
  color: white;
}

.ar-launch-button {
  background: var(--pg-accent);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ar-launch-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}
```

##### AR Session Interface
```css
.ar-session {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 1000;
}

.ar-controls-panel {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: var(--media-control);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.ar-material-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.ar-material-option {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ar-material-option:hover {
  border-color: white;
  transform: scale(1.1);
}

.ar-material-option.active {
  border-color: var(--pg-accent);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}
```

#### Installation Guide Components

##### Guide Header
```css
.installation-guide-header {
  background: linear-gradient(135deg, var(--pg-primary) 0%, #333333 100%);
  color: white;
  padding: 32px;
  border-radius: 16px 16px 0 0;
}

.guide-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.guide-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}

.difficulty-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.difficulty-beginner {
  background: #d4edda;
  color: #155724;
}

.difficulty-intermediate {
  background: #fff3cd;
  color: #856404;
}

.difficulty-advanced {
  background: #f8d7da;
  color: #721c24;
}
```

##### Step Navigation
```css
.step-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.step-nav-buttons {
  display: flex;
  gap: 8px;
}

.step-nav-button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.step-nav-button:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.step-nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 120px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pg-accent) 0%, #0056b3 100%);
  transition: width 0.3s ease;
}
```

##### Media Annotations
```css
.media-annotation {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.annotation-info {
  background: #007bff;
}

.annotation-warning {
  background: #dc3545;
}

.annotation-tip {
  background: #28a745;
}

.annotation-measurement {
  background: #6f42c1;
}

.media-annotation:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.annotation-popup {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  max-width: 200px;
  z-index: 20;
  margin-bottom: 8px;
}

.annotation-popup::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: white;
}
```

### Responsive Design Standards

#### Breakpoint System
```css
/* Mobile First Approach */
:root {
  --mobile: 320px;
  --mobile-large: 425px;
  --tablet: 768px;
  --laptop: 1024px;
  --desktop: 1440px;
  --desktop-large: 2560px;
}

/* Gallery Responsive Behavior */
@media (max-width: 768px) {
  .enhanced-gallery {
    border-radius: 8px;
  }

  .gallery-main-viewer {
    aspect-ratio: 1/1;
  }

  .gallery-thumbnails {
    padding: 12px;
    gap: 6px;
  }

  .gallery-thumbnail {
    width: 60px;
    height: 60px;
  }

  .gallery-controls {
    bottom: 12px;
    right: 12px;
    gap: 6px;
  }

  .gallery-control-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 425px) {
  .gallery-thumbnails {
    padding: 8px;
    gap: 4px;
  }

  .gallery-thumbnail {
    width: 48px;
    height: 48px;
  }
}
```

#### Touch Interactions
```css
/* Touch-friendly targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Gesture indicators */
.swipe-indicator {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  opacity: 0.6;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Touch feedback */
.touch-feedback {
  position: relative;
  overflow: hidden;
}

.touch-feedback::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.touch-feedback:active::after {
  opacity: 1;
}
```

### Loading States & Animations

#### Skeleton Loaders
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-image {
  aspect-ratio: 4/3;
  border-radius: 8px;
}

.skeleton-text {
  height: 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.title {
  height: 24px;
  width: 70%;
}

.skeleton-text.subtitle {
  height: 16px;
  width: 50%;
}
```

#### Progress Indicators
```css
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid var(--pg-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.upload-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--pg-accent), #0056b3);
  transition: width 0.3s ease;
}

.upload-progress.indeterminate .upload-progress-bar {
  width: 30%;
  animation: indeterminate 2s ease-in-out infinite;
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
```

### Accessibility Standards

#### WCAG 2.1 AA Compliance
```css
/* Focus indicators */
.focusable:focus {
  outline: 2px solid var(--pg-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .gallery-thumbnail {
    border-width: 3px;
  }

  .gallery-control-button {
    border: 2px solid;
  }

  .media-annotation {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .skeleton {
    animation: none;
    background: #f0f0f0;
  }
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### Color Contrast Requirements
```css
/* Text contrast ratios */
.text-primary {
  color: #1a1a1a; /* 15.3:1 ratio on white */
}

.text-secondary {
  color: #4a5568; /* 7.5:1 ratio on white */
}

.text-muted {
  color: #6c757d; /* 4.5:1 ratio on white - minimum AA */
}

/* Interactive element contrast */
.button-primary {
  background: #007bff; /* 4.5:1 ratio for white text */
  color: white;
}

.button-secondary {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff; /* 3:1 ratio for border */
}

/* Status colors with sufficient contrast */
.status-success {
  background: #28a745;
  color: white; /* 4.5:1 ratio */
}

.status-warning {
  background: #ffc107;
  color: #1a1a1a; /* 11.7:1 ratio */
}

.status-error {
  background: #dc3545;
  color: white; /* 5.9:1 ratio */
}
```

### Performance Standards

#### Critical CSS Inline Limit
- Maximum 14KB inline CSS
- Above-the-fold styles prioritized
- Non-critical styles loaded asynchronously

#### Animation Performance
```css
/* GPU-accelerated animations */
.smooth-animation {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Efficient transitions */
.efficient-transition {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

/* Avoid expensive properties */
.avoid {
  /* Don't animate these properties */
  /* width, height, top, left, margin, padding */
}

.prefer {
  /* Animate these instead */
  transform: scale(1.1);
  opacity: 0.8;
}
```

### Media Asset Guidelines

#### Image Specifications
- **Format Priority**: WebP > AVIF > JPEG > PNG
- **Quality Settings**: 85% for hero images, 75% for thumbnails
- **Dimensions**: Multiple sizes (300w, 600w, 1200w, 1920w)
- **Aspect Ratios**: 4:3 for products, 16:9 for lifestyle

#### Video Specifications
- **Format**: MP4 (H.264) primary, WebM (VP9) fallback
- **Resolution**: 1080p maximum, 720p mobile optimized
- **Bitrate**: 2-4 Mbps for 1080p, 1-2 Mbps for 720p
- **Duration**: 30 seconds maximum for auto-play content

#### AR Model Specifications
- **Format**: GLB/GLTF 2.0
- **Polygon Count**: <10,000 triangles
- **Texture Resolution**: 1024×1024px maximum
- **File Size**: <5MB per model
- **LOD**: Multiple detail levels for performance

### Implementation Checklist

#### Component Requirements
- [ ] Responsive design (mobile-first)
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimization (<100ms interactions)
- [ ] Loading states and error handling
- [ ] Touch gesture support
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] High contrast mode support
- [ ] Reduced motion support

#### Quality Assurance
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Device testing (iOS, Android, Desktop)
- [ ] Performance monitoring (Core Web Vitals)
- [ ] Accessibility auditing (axe-core, WAVE)
- [ ] Visual regression testing
- [ ] User acceptance testing

This comprehensive style guide ensures consistent, accessible, and performant media experiences across the PG Closets e-commerce platform while maintaining brand identity and user-centric design principles.