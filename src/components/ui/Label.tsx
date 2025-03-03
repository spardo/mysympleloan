import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  className?: string;
}

export default function Label({ 
  children, 
  optional = false,
  required = false,
  className = '',
  ...props 
}: LabelProps) {
  return (
    <label 
      className={`block text-sm font-semibold text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
      {optional && (
        <span className="text-gray-500 font-normal ml-1">(Optional)</span>
      )}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
  );
}