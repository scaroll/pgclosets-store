import React from 'react';

interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg';
  variant?: 'primary' | 'secondary' | 'muted';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

const Text: React.FC<TextProps> = ({
  size = 'base',
  variant = 'primary',
  children,
  className = '',
  as = 'p'
}) => {
  const Tag = as;

  const sizeClasses = {
    xs: 'body-sm',
    sm: 'body-sm',
    base: 'body',
    lg: 'body-lg'
  };

  const variantClasses = {
    primary: 'text-[var(--color-text-primary)]',
    secondary: 'text-[var(--color-text-secondary)]',
    muted: 'text-[var(--color-text-muted)]'
  };

  return (
    <Tag className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Text;
