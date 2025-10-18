'use client';

import { useState } from 'react';
import { useDesignSystem, useResponsive } from '@/lib/design-system-provider';
import { ds } from '@/lib/design-utils';

export default function DesignSystemShowcase() {
  const { theme, setTheme } = useDesignSystem();
  const { breakpoint, isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'components' | 'spacing'>('colors');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
        <div className="container-max py-6">
          <div className="flex items-center justify-between">
            <h1 className="heading-2">PG Closets Design System</h1>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn-secondary"
            >
              {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
            </button>
          </div>
          <p className="body-regular text-[var(--text-secondary)] mt-2">
            Current breakpoint: {breakpoint} | Mobile: {isMobile ? 'Yes' : 'No'}
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="container-max">
          <div className="flex gap-2 overflow-x-auto py-4">
            {(['colors', 'typography', 'components', 'spacing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={ds.cn(
                  'px-4 py-2 rounded-lg capitalize transition-colors',
                  activeTab === tab
                    ? 'bg-[var(--color-primary)] text-[var(--color-secondary)]'
                    : 'hover:bg-[var(--bg-tertiary)]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container-max py-8">
        {activeTab === 'colors' && <ColorSection />}
        {activeTab === 'typography' && <TypographySection />}
        {activeTab === 'components' && <ComponentSection />}
        {activeTab === 'spacing' && <SpacingSection />}
      </main>
    </div>
  );
}

function ColorSection() {
  const colors = [
    { name: 'Primary', var: '--color-primary' },
    { name: 'Secondary', var: '--color-secondary' },
    { name: 'Accent', var: '--color-accent' },
    { name: 'Text Primary', var: '--text-primary' },
    { name: 'Text Secondary', var: '--text-secondary' },
    { name: 'Text Muted', var: '--text-muted' },
    { name: 'BG Primary', var: '--bg-primary' },
    { name: 'BG Secondary', var: '--bg-secondary' },
    { name: 'Border Default', var: '--border-default' },
  ];

  const statusColors = [
    { name: 'Success', var: '--status-success', bg: '#10b981' },
    { name: 'Warning', var: '--status-warning', bg: '#f59e0b' },
    { name: 'Error', var: '--status-error', bg: '#dc2626' },
    { name: 'Info', var: '--status-info', bg: '#2563eb' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="heading-3 mb-4">Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map(({ name, var: cssVar }) => (
            <div key={cssVar} className="card p-4">
              <div
                className="w-full h-20 rounded-lg mb-3 border border-[var(--border-default)]"
                style={{ backgroundColor: `var(${cssVar})` }}
              />
              <p className="body-small font-medium">{name}</p>
              <code className="caption text-[var(--text-muted)]">{cssVar}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-4">Status Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusColors.map(({ name, var: cssVar, bg }) => (
            <div key={cssVar} className="card p-4">
              <div
                className="w-full h-20 rounded-lg mb-3"
                style={{ backgroundColor: bg }}
              />
              <p className="body-small font-medium">{name}</p>
              <code className="caption text-[var(--text-muted)]">{cssVar}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TypographySection() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="heading-3 mb-6">Headings</h2>
        <div className="space-y-6">
          <div>
            <h1 className="heading-1">Heading 1 - Premium Closet Solutions</h1>
            <code className="caption text-[var(--text-muted)]">.heading-1</code>
          </div>
          <div>
            <h2 className="heading-2">Heading 2 - Transform Your Space</h2>
            <code className="caption text-[var(--text-muted)]">.heading-2</code>
          </div>
          <div>
            <h3 className="heading-3">Heading 3 - Our Services</h3>
            <code className="caption text-[var(--text-muted)]">.heading-3</code>
          </div>
          <div>
            <h4 className="heading-4">Heading 4 - Product Details</h4>
            <code className="caption text-[var(--text-muted)]">.heading-4</code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Body Text</h2>
        <div className="space-y-4">
          <div>
            <p className="body-large">Large body text for emphasis and introductions.</p>
            <code className="caption text-[var(--text-muted)]">.body-large</code>
          </div>
          <div>
            <p className="body-regular">Regular body text for standard content and paragraphs.</p>
            <code className="caption text-[var(--text-muted)]">.body-regular</code>
          </div>
          <div>
            <p className="body-small">Small body text for supporting content and descriptions.</p>
            <code className="caption text-[var(--text-muted)]">.body-small</code>
          </div>
          <div>
            <span className="caption">Caption text for labels and metadata.</span>
            <br />
            <code className="caption text-[var(--text-muted)]">.caption</code>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComponentSection() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="heading-3 mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-ghost">Ghost Button</button>
          <button className="btn-primary" disabled>Disabled Button</button>
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <h3 className="heading-4 mb-2">Standard Card</h3>
            <p className="body-regular text-[var(--text-secondary)]">
              Basic card with shadow and border.
            </p>
          </div>
          <div className="card-interactive p-6">
            <h3 className="heading-4 mb-2">Interactive Card</h3>
            <p className="body-regular text-[var(--text-secondary)]">
              Hoverable card with enhanced effects.
            </p>
          </div>
          <div className="card-flat">
            <h3 className="heading-4 mb-2">Flat Card</h3>
            <p className="body-regular text-[var(--text-secondary)]">
              Minimal card without shadows.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="body-small font-medium mb-2 block">Input Field</label>
            <input type="text" className="input" placeholder="Enter text" />
          </div>
          <div>
            <label className="body-small font-medium mb-2 block">Select Field</label>
            <select className="select">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label className="body-small font-medium mb-2 block">Textarea</label>
            <textarea className="textarea" placeholder="Enter message" rows={3} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="checkbox" />
              <span className="body-regular">Checkbox</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="radio" className="radio" />
              <span className="body-regular">Radio</span>
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Loading States</h2>
        <div className="space-y-4">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text w-3/4"></div>
          <div className="flex gap-4">
            <div className="skeleton-avatar"></div>
            <div className="flex-1">
              <div className="skeleton-text mb-2"></div>
              <div className="skeleton-text w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SpacingSection() {
  const spacings = [
    { name: 'xs', value: '4px' },
    { name: 'sm', value: '8px' },
    { name: 'md', value: '16px' },
    { name: 'lg', value: '24px' },
    { name: 'xl', value: '32px' },
    { name: '2xl', value: '48px' },
    { name: '3xl', value: '64px' },
    { name: '4xl', value: '96px' },
  ];

  const shadows = [
    'xs', 'sm', 'md', 'lg', 'xl', '2xl'
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="heading-3 mb-6">Spacing Scale</h2>
        <div className="space-y-4">
          {spacings.map(({ name, value }) => (
            <div key={name} className="flex items-center gap-4">
              <code className="caption text-[var(--text-muted)] w-16">--spacing-{name}</code>
              <div
                className="bg-[var(--color-accent)] opacity-75"
                style={{
                  width: `var(--spacing-${name})`,
                  height: `var(--spacing-${name})`,
                }}
              />
              <span className="body-small">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Shadow Scale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shadows.map((size) => (
            <div key={size} className="text-center">
              <div
                className="bg-white rounded-lg p-6 mb-2"
                style={{ boxShadow: `var(--shadow-${size})` }}
              >
                <p className="body-regular">Shadow {size.toUpperCase()}</p>
              </div>
              <code className="caption text-[var(--text-muted)]">--shadow-{size}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading-3 mb-6">Border Radius</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['sm', 'md', 'lg', 'xl', '2xl', 'full'].map((size) => (
            <div key={size} className="text-center">
              <div
                className="w-24 h-24 bg-[var(--bg-tertiary)] border-2 border-[var(--border-default)] mb-2 mx-auto"
                style={{ borderRadius: `var(--radius-${size})` }}
              />
              <code className="caption text-[var(--text-muted)]">--radius-{size}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}