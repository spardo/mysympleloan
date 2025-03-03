import React from 'react';

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
}

export default function Description({ 
  children, 
  className = '',
  size = 'base'
}: DescriptionProps) {
  const baseStyles = 'text-gray-600';
  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  return (
    <p className={`${baseStyles} ${sizes[size]} ${className}`}>
      {children}
    </p>
  );
}