import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'muted';
type ButtonSize = 'default' | 'lg' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  loadingText,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  as = 'button',
  href,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition duration-200 rounded-lg focus:outline-none focus:ring-4';
  
  const variants = {
    primary: 'bg-[#b3905e] text-white hover:bg-[#9a7a4f] focus:ring-[#b3905e]/20 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-[#212d52] text-white hover:bg-[#1a2441] focus:ring-[#212d52]/20 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-white text-[#212d52] border-2 border-[#212d52] hover:bg-[#212d52]/5 focus:ring-[#212d52]/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed',
    muted: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-6 py-4 text-2xl'
  };

  const width = fullWidth ? 'w-full' : '';
  const Component = as;

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      disabled={loading || disabled}
      href={href}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText || 'Loading...'}</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </Component>
  );
}