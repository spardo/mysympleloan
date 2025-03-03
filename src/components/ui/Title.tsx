import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function Title({ 
  children, 
  className = '', 
  as: Component = 'h2' 
}: TitleProps) {
  const baseStyles = 'font-bold text-gray-900';
  const sizes = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base'
  };

  return (
    <Component className={`${baseStyles} ${sizes[Component]} ${className}`}>
      {children}
    </Component>
  );
}