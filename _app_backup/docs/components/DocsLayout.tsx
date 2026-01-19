import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import getNavigation from '../utils/getNavigation';
import { colors, spacing } from '@/lib/design-tokens';

interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const navigation = getNavigation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar navigation={navigation} />
      <main
        style={{
          flex: 1,
          maxWidth: '896px',
          margin: '0 auto',
          padding: spacing['8'],
          backgroundColor: colors.gray[50],
        }}
      >
        {children}
      </main>
    </div>
  );
}
