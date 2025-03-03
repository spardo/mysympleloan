import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionLinkProps {
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function ActionLink({
  onClick,
  href,
  icon: Icon,
  children,
  className = '',
  align = 'center'
}: ActionLinkProps) {
  const baseStyles = "inline-flex items-center gap-2 text-[#212d52] hover:text-[#1a2441] font-medium transition-colors";
  const alignStyles = {
    left: '',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick };

  return (
    <Component
      className={`${baseStyles} ${alignStyles[align]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Component>
  );
}