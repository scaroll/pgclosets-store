/**
 * Container & Layout Components
 * Token-based layout system for consistent spacing and structure
 * Accessibility: Semantic HTML, landmark regions
 */

import React from 'react';
import { spacing, breakpoints, colors } from '@/lib/design-tokens';

/* ========================================
   PAGE CONTAINER
======================================== */

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  as?: 'div' | 'main' | 'article' | 'section';
  centered?: boolean;
}

const maxWidths = {
  sm: '640px',
  md: breakpoints.md,
  lg: breakpoints.lg,
  xl: breakpoints.xl,
  full: '100%',
} as const;

const containerPadding = {
  none: '0',
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
} as const;

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  className = '',
  as: Component = 'div',
  centered = true,
}) => (
  <Component
    className={`page-container ${className}`}
    style={{
      width: '100%',
      maxWidth: maxWidths[maxWidth],
      marginLeft: centered ? 'auto' : undefined,
      marginRight: centered ? 'auto' : undefined,
      paddingLeft: containerPadding[padding],
      paddingRight: containerPadding[padding],
    }}
  >
    {children}
  </Component>
);

/* ========================================
   SECTION
======================================== */

interface SectionProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  as?: 'section' | 'div' | 'article' | 'aside';
  className?: string;
  id?: string;
  ariaLabel?: string;
}

const sectionSpacing = {
  xs: spacing[8],
  sm: spacing[12],
  md: spacing[16],
  lg: spacing[20],
  xl: spacing[24],
  '2xl': spacing[32],
} as const;

export const Section: React.FC<SectionProps> = ({
  children,
  spacing: spacingSize = 'md',
  background = 'transparent',
  borderTop = false,
  borderBottom = false,
  as: Component = 'section',
  className = '',
  id,
  ariaLabel,
}) => (
  <Component
    id={id}
    className={`section ${className}`}
    aria-label={ariaLabel}
    style={{
      paddingTop: sectionSpacing[spacingSize],
      paddingBottom: sectionSpacing[spacingSize],
      background,
      borderTop: borderTop ? `1px solid ${colors.gray[200]}` : undefined,
      borderBottom: borderBottom ? `1px solid ${colors.gray[200]}` : undefined,
    }}
  >
    {children}
  </Component>
);

/* ========================================
   GRID SYSTEM
======================================== */

interface GridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: keyof typeof spacing;
  rowGap?: keyof typeof spacing;
  colGap?: keyof typeof spacing;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'lg',
  rowGap,
  colGap,
  className = '',
  as: Component = 'div',
}) => {
  const finalRowGap = rowGap || gap;
  const finalColGap = colGap || gap;

  return (
    <Component
      className={`grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols.default || 1}, 1fr)`,
        gap: `${spacing[finalRowGap]} ${spacing[finalColGap]}`,
      }}
    >
      <style jsx>{`
        @media (min-width: ${breakpoints.sm}) {
          .grid {
            grid-template-columns: repeat(${cols.sm || cols.default || 1}, 1fr);
          }
        }
        @media (min-width: ${breakpoints.md}) {
          .grid {
            grid-template-columns: repeat(${cols.md || cols.sm || cols.default || 1}, 1fr);
          }
        }
        @media (min-width: ${breakpoints.lg}) {
          .grid {
            grid-template-columns: repeat(${cols.lg || cols.md || cols.sm || cols.default || 1}, 1fr);
          }
        }
        @media (min-width: ${breakpoints.xl}) {
          .grid {
            grid-template-columns: repeat(${cols.xl || cols.lg || cols.md || cols.sm || cols.default || 1}, 1fr);
          }
        }
      `}</style>
      {children}
    </Component>
  );
};

/* ========================================
   FLEX LAYOUTS
======================================== */

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: keyof typeof spacing;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'nav';
}

const alignItems = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

const justifyContent = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const;

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  as: Component = 'div',
}) => (
  <Component
    className={`stack ${className}`}
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: spacing[gap],
      alignItems: alignItems[align],
      justifyContent: justifyContent[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
    }}
  >
    {children}
  </Component>
);

// Horizontal stack (convenience wrapper)
export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="row" />
);

// Vertical stack (convenience wrapper)
export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack {...props} direction="column" />
);

/* ========================================
   BOX (Utility container)
======================================== */

interface BoxProps {
  children: React.ReactNode;
  p?: keyof typeof spacing;
  px?: keyof typeof spacing;
  py?: keyof typeof spacing;
  pt?: keyof typeof spacing;
  pr?: keyof typeof spacing;
  pb?: keyof typeof spacing;
  pl?: keyof typeof spacing;
  m?: keyof typeof spacing;
  mx?: keyof typeof spacing;
  my?: keyof typeof spacing;
  mt?: keyof typeof spacing;
  mr?: keyof typeof spacing;
  mb?: keyof typeof spacing;
  ml?: keyof typeof spacing;
  bg?: string;
  color?: string;
  className?: string;
  as?: React.ElementType;
}

export const Box: React.FC<BoxProps> = ({
  children,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  bg,
  color,
  className = '',
  as: Component = 'div',
}) => {
  const style: React.CSSProperties = {
    padding: p ? spacing[p] : undefined,
    paddingLeft: pl ? spacing[pl] : px ? spacing[px] : undefined,
    paddingRight: pr ? spacing[pr] : px ? spacing[px] : undefined,
    paddingTop: pt ? spacing[pt] : py ? spacing[py] : undefined,
    paddingBottom: pb ? spacing[pb] : py ? spacing[py] : undefined,
    margin: m ? spacing[m] : undefined,
    marginLeft: ml ? spacing[ml] : mx ? spacing[mx] : undefined,
    marginRight: mr ? spacing[mr] : mx ? spacing[mx] : undefined,
    marginTop: mt ? spacing[mt] : my ? spacing[my] : undefined,
    marginBottom: mb ? spacing[mb] : my ? spacing[my] : undefined,
    background: bg,
    color,
  };

  return (
    <Component className={`box ${className}`} style={style}>
      {children}
    </Component>
  );
};

/* ========================================
   ASPECT RATIO (Media container)
======================================== */

interface AspectRatioProps {
  children: React.ReactNode;
  ratio: '16/9' | '4/3' | '1/1' | '3/4' | '9/16' | number;
  className?: string;
}

const ratioValues = {
  '16/9': 56.25,
  '4/3': 75,
  '1/1': 100,
  '3/4': 133.33,
  '9/16': 177.78,
} as const;

export const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio,
  className = '',
}) => {
  const paddingTop =
    typeof ratio === 'number' ? `${ratio}%` : `${ratioValues[ratio]}%`;

  return (
    <div
      className={`aspect-ratio ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ========================================
   DIVIDER
======================================== */

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: keyof typeof spacing;
  color?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing: spacingSize = 'md',
  color = colors.gray[200],
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <hr
      className={`divider ${className}`}
      role="separator"
      aria-orientation={orientation}
      style={{
        border: 'none',
        backgroundColor: color,
        width: isHorizontal ? '100%' : '1px',
        height: isHorizontal ? '1px' : '100%',
        marginTop: isHorizontal ? spacing[spacingSize] : undefined,
        marginBottom: isHorizontal ? spacing[spacingSize] : undefined,
        marginLeft: !isHorizontal ? spacing[spacingSize] : undefined,
        marginRight: !isHorizontal ? spacing[spacingSize] : undefined,
      }}
    />
  );
};

/* ========================================
   USAGE EXAMPLES
======================================== */

/*
// Page layout
<PageContainer maxWidth="lg" padding="md">
  <Section spacing="xl" background={colors.gray[50]}>
    <Heading level="1">Welcome to PG Closets</Heading>
  </Section>
</PageContainer>

// Grid layout
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
  <UnifiedCard>Product 1</UnifiedCard>
  <UnifiedCard>Product 2</UnifiedCard>
  <UnifiedCard>Product 3</UnifiedCard>
</Grid>

// Flex layouts
<HStack gap="md" align="center" justify="between">
  <Heading level="2">Products</Heading>
  <button>View All</button>
</HStack>

<VStack gap="sm">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</VStack>

// Box utility
<Box p="lg" bg={colors.gray[100]} mb="md">
  <Text>Padded content box</Text>
</Box>

// Aspect ratio (images/videos)
<AspectRatio ratio="16/9">
  <img src="/image.jpg" alt="Product" style={{ objectFit: 'cover' }} />
</AspectRatio>

// Divider
<VStack gap="md">
  <Text>Section 1</Text>
  <Divider />
  <Text>Section 2</Text>
</VStack>

// Nested layout example
<PageContainer maxWidth="xl">
  <Section spacing="2xl" ariaLabel="Featured products">
    <VStack gap="xl">
      <Box px="md">
        <Heading level="1" align="center">Our Collections</Heading>
      </Box>
      <Grid cols={{ default: 1, sm: 2, lg: 3 }} gap="lg">
        <UnifiedCard variant="elevated">
          <AspectRatio ratio="4/3">
            <img src="/closet1.jpg" alt="Closet system" />
          </AspectRatio>
          <CardContent>
            <Heading level="3">Custom Closets</Heading>
          </CardContent>
        </UnifiedCard>
      </Grid>
    </VStack>
  </Section>
</PageContainer>
*/
