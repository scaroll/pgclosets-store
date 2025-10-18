import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  balance?: boolean;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ level, children, balance = false, className = '' }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const headingClasses = {
    1: 'heading-1',
    2: 'heading-2',
    3: 'heading-3',
    4: 'heading-4',
    5: 'heading-5',
    6: 'heading-6'
  };

  const balanceStyle = balance ? { textWrap: 'balance' as const } : {};

  return (
    <Tag className={`${headingClasses[level]} ${className}`} style={balanceStyle}>
      {children}
    </Tag>
  );
};

export default Heading;
