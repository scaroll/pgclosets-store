import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { ReactNode } from 'react';
import { colors, typography, spacing, radius, shadows } from '@/lib/design-tokens';

/**
 * Custom MDX components using PG Closets design tokens
 */
const components = {
  // Typography
  h1: ({ children }: { children: ReactNode }) => (
    <h1
      style={{
        fontSize: typography.sizes['4xl'][0],
        fontWeight: typography.weights.bold,
        fontFamily: typography.fonts.display,
        color: colors.gray[900],
        marginTop: spacing['8'],
        marginBottom: spacing['4'],
        lineHeight: typography.lineHeights.tight,
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </h1>
  ),

  h2: ({ children }: { children: ReactNode }) => (
    <h2
      style={{
        fontSize: typography.sizes['3xl'][0],
        fontWeight: typography.weights.semibold,
        fontFamily: typography.fonts.display,
        color: colors.gray[900],
        marginTop: spacing['8'],
        marginBottom: spacing['4'],
        lineHeight: typography.lineHeights.snug,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  ),

  h3: ({ children }: { children: ReactNode }) => (
    <h3
      style={{
        fontSize: typography.sizes['2xl'][0],
        fontWeight: typography.weights.semibold,
        fontFamily: typography.fonts.body,
        color: colors.gray[800],
        marginTop: spacing['6'],
        marginBottom: spacing['3'],
        lineHeight: typography.lineHeights.snug,
      }}
    >
      {children}
    </h3>
  ),

  h4: ({ children }: { children: ReactNode }) => (
    <h4
      style={{
        fontSize: typography.sizes.xl[0],
        fontWeight: typography.weights.semibold,
        fontFamily: typography.fonts.body,
        color: colors.gray[800],
        marginTop: spacing['6'],
        marginBottom: spacing['2'],
      }}
    >
      {children}
    </h4>
  ),

  p: ({ children }: { children: ReactNode }) => (
    <p
      style={{
        fontSize: typography.sizes.base[0],
        lineHeight: typography.lineHeights.relaxed,
        color: colors.gray[700],
        marginBottom: spacing['4'],
        fontFamily: typography.fonts.body,
      }}
    >
      {children}
    </p>
  ),

  // Lists
  ul: ({ children }: { children: ReactNode }) => (
    <ul
      style={{
        listStyle: 'disc',
        paddingLeft: spacing['6'],
        marginBottom: spacing['4'],
        color: colors.gray[700],
      }}
    >
      {children}
    </ul>
  ),

  ol: ({ children }: { children: ReactNode }) => (
    <ol
      style={{
        listStyle: 'decimal',
        paddingLeft: spacing['6'],
        marginBottom: spacing['4'],
        color: colors.gray[700],
      }}
    >
      {children}
    </ol>
  ),

  li: ({ children }: { children: ReactNode }) => (
    <li
      style={{
        marginBottom: spacing['2'],
        lineHeight: typography.lineHeights.relaxed,
      }}
    >
      {children}
    </li>
  ),

  // Links
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      style={{
        color: colors.interactive.link,
        textDecoration: 'underline',
        textDecorationColor: colors.gray[300],
        textUnderlineOffset: '2px',
        transition: 'color 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = colors.interactive.linkHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = colors.interactive.link;
      }}
    >
      {children}
    </a>
  ),

  // Code
  code: ({ children }: { children: ReactNode }) => (
    <code
      style={{
        fontFamily: typography.fonts.mono,
        fontSize: '0.875em',
        backgroundColor: colors.gray[100],
        color: colors.gray[800],
        padding: '0.125rem 0.375rem',
        borderRadius: radius.sm,
        border: `1px solid ${colors.gray[200]}`,
      }}
    >
      {children}
    </code>
  ),

  pre: ({ children }: { children: ReactNode }) => (
    <pre
      style={{
        fontFamily: typography.fonts.mono,
        fontSize: typography.sizes.sm[0],
        backgroundColor: colors.gray[900],
        color: colors.gray[100],
        padding: spacing['4'],
        borderRadius: radius.lg,
        overflow: 'auto',
        marginBottom: spacing['4'],
        border: `1px solid ${colors.gray[800]}`,
      }}
    >
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote
      style={{
        borderLeft: `4px solid ${colors.brand.navy}`,
        paddingLeft: spacing['4'],
        marginLeft: 0,
        marginBottom: spacing['4'],
        fontStyle: 'italic',
        color: colors.gray[600],
      }}
    >
      {children}
    </blockquote>
  ),

  // Table
  table: ({ children }: { children: ReactNode }) => (
    <div style={{ overflowX: 'auto', marginBottom: spacing['4'] }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: typography.sizes.sm[0],
        }}
      >
        {children}
      </table>
    </div>
  ),

  th: ({ children }: { children: ReactNode }) => (
    <th
      style={{
        backgroundColor: colors.gray[50],
        padding: spacing['3'],
        textAlign: 'left',
        fontWeight: typography.weights.semibold,
        borderBottom: `2px solid ${colors.gray[200]}`,
        color: colors.gray[900],
      }}
    >
      {children}
    </th>
  ),

  td: ({ children }: { children: ReactNode }) => (
    <td
      style={{
        padding: spacing['3'],
        borderBottom: `1px solid ${colors.gray[200]}`,
        color: colors.gray[700],
      }}
    >
      {children}
    </td>
  ),

  // Horizontal rule
  hr: () => (
    <hr
      style={{
        border: 'none',
        borderTop: `1px solid ${colors.gray[200]}`,
        marginTop: spacing['8'],
        marginBottom: spacing['8'],
      }}
    />
  ),

  // Custom components
  Callout: ({
    type = 'info',
    children,
  }: {
    type?: 'info' | 'warning' | 'success' | 'error';
    children: ReactNode;
  }) => {
    const styles = {
      info: {
        bg: colors.semantic.info.light,
        border: colors.semantic.info.DEFAULT,
      },
      warning: {
        bg: colors.semantic.warning.light,
        border: colors.semantic.warning.DEFAULT,
      },
      success: {
        bg: colors.semantic.success.light,
        border: colors.semantic.success.DEFAULT,
      },
      error: {
        bg: colors.semantic.error.light,
        border: colors.semantic.error.DEFAULT,
      },
    };

    return (
      <div
        style={{
          backgroundColor: styles[type].bg,
          borderLeft: `4px solid ${styles[type].border}`,
          padding: spacing['4'],
          borderRadius: radius.md,
          marginBottom: spacing['4'],
        }}
      >
        {children}
      </div>
    );
  },

  Card: ({ children }: { children: ReactNode }) => (
    <div
      style={{
        backgroundColor: colors.gray[50],
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: radius.xl,
        padding: spacing['6'],
        marginBottom: spacing['4'],
        boxShadow: shadows.sm,
      }}
    >
      {children}
    </div>
  ),
};

/**
 * Custom MDX component with PG Closets styling
 */
export function CustomMDX(props: MDXRemoteProps) {
  return <MDXRemote {...props} components={components} />;
}

export { components };
