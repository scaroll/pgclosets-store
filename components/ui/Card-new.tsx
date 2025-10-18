import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className = ''
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClass = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    : '';

  return (
    <div
      className={`bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] ${paddingClasses[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
