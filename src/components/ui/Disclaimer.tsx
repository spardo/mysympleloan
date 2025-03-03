import React from 'react';

interface DisclaimerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Disclaimer({ children, className = '' }: DisclaimerProps) {
  const replaceLinks = (content: React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') {
      return React.Children.map(content, child => {
        if (React.isValidElement(child)) {
          if (child.type === 'a') {
            return React.cloneElement(child, {
              className: 'text-inherit underline hover:text-gray-600 transition-colors'
            });
          }
          if (child.props.children) {
            return React.cloneElement(child, {
              children: replaceLinks(child.props.children)
            });
          }
        }
        return child;
      });
    }
    return content;
  };

  return (
    <div className={`text-sm text-gray-400 ${className}`}>
      {replaceLinks(children)}
    </div>
  );
}