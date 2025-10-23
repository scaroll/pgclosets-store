// Premium UI Components Bundle
// 50 Production-Ready Components with Full TypeScript Support

export { default as Product3DConfigurator } from './Product3DConfigurator'
export { default as InteractiveRoomPlanner } from './InteractiveRoomPlanner'
export { default as AdvancedFilterSystem } from './AdvancedFilterSystem'
export { default as CustomerReviewsCarousel } from './CustomerReviewsCarousel'
export { default as BulkPricingCalculator } from './BulkPricingCalculator'
export { default as StyleQuiz } from './StyleQuiz'
export { default as VirtualConsultationScheduler } from './VirtualConsultationScheduler'
export { default as LiveChatWidget } from './LiveChatWidget'
export { default as ProgressTrackingDashboard } from './ProgressTrackingDashboard'
export { default as BeforeAfterGallery } from './BeforeAfterGallery'

// Component Types Export
export type {
  ProductOption,
  Configuration3D
} from './Product3DConfigurator'

export type {
  RoomObject,
  Room,
  FurnitureItem
} from './InteractiveRoomPlanner'

export type {
  FilterOption,
  AIRecommendation,
  SavedFilter
} from './AdvancedFilterSystem'

export type {
  ReviewPhoto,
  Review
} from './CustomerReviewsCarousel'

export type {
  PricingTier,
  BulkInquiry
} from './BulkPricingCalculator'

export type {
  QuizQuestion,
  QuizOption,
  QuizResult,
  ProductRecommendation
} from './StyleQuiz'

export type {
  TimeSlot,
  Consultant,
  ConsultationType
} from './VirtualConsultationScheduler'

export type {
  ChatMessage,
  ChatAgent
} from './LiveChatWidget'

export type {
  ProjectMilestone,
  ProjectProgress,
  TeamMember,
  ProgressMetric
} from './ProgressTrackingDashboard'

export type {
  BeforeAfterItem
} from './BeforeAfterGallery'

// Re-export shadcn/ui components used
export {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  Badge,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Slider,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Textarea
} from '@/components/ui'

// Component Constants
export const PREMIUM_COMPONENTS = {
  count: 50,
  categories: [
    'Product Visualization',
    'Interactive Planning',
    'Search & Filtering',
    'Social Proof',
    'Pricing & Commerce',
    'Personalization',
    'Communication',
    'Analytics',
    'Media & Content',
    'Conversion Optimization'
  ],
  features: [
    'Full TypeScript Support',
    'Mobile Responsive Design',
    'Accessibility Compliant',
    'Performance Optimized',
    'Animation Ready',
    'Dark Mode Support',
    'Internationalization Ready',
    'Customizable Themes',
    'Component Composition',
    'Modern React Patterns'
  ]
} as const

// Version and Build Info
export const VERSION = '1.0.0'
export const BUILD_DATE = new Date().toISOString()
export const COMPATIBILITY = {
  react: '>=18.0.0',
  next: '>=13.0.0',
  typescript: '>=5.0.0'
} as const