import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'light';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  containerWidth?: 'full' | 'xl' | '2xl';
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  spacing = 'lg',
  containerWidth = 'xl',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-[var(--color-bg-primary)]',
    dark: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]',
    light: 'bg-[var(--color-bg-primary)]'
  };

  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  const widthClasses = {
    full: 'max-w-full',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl'
  };

  return (
    <section className={`${variantClasses[variant]} ${spacingClasses[spacing]} ${className}`}>
      <div className={`container mx-auto px-4 ${widthClasses[containerWidth]}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
