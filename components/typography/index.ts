/**
 * Typography System Entry Point
 * Centralized exports for all typography components
 */

// Headline System
export {
  Headline,
  HeroHeadline,
  SectionHeadline,
  FeatureCallout,
  AnimatedHeadline,
} from './Headline'

// Body Text System
export {
  Text,
  Lead,
  Caption as BodyCaption,
  Label,
  LinkText,
  ReadingContainer,
  Prose,
} from './Text'

// Navigation & UI Text
export {
  NavLink,
  FooterLink,
  Breadcrumb,
  ButtonText,
  FormLabel,
  HelperText,
  BadgeText,
  MenuItemText,
  TabText,
} from './NavigationText'

// Product Copy System
export {
  ProductHero,
  FeatureHighlight,
  ProductBenefit,
  TechSpecs,
  FeatureGrid,
  ProductStatement,
  ComparisonTable,
} from '../product/ProductCopy'

// Legacy Typography from ui/Typography (no Text - already exported above)
export { Display, Heading, TextLink, Blockquote } from '../ui/Typography'

// Additional legacy components from typography.tsx
export { H1, H2, H3, H4, H5, H6, Body, BodySmall, BodyLarge, Caption, Overline } from './typography'
