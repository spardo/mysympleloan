import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

type ErrorSeverity = 'error' | 'warning';
type ErrorAlignment = 'left' | 'center';

interface ErrorMessageProps {
  title?: string;
  message: string | null;
  severity?: ErrorSeverity;
  className?: string;
  icon?: boolean;
  align?: ErrorAlignment;
}

export default function ErrorMessage({ 
  title,
  message, 
  severity = 'error',
  className = '',
  icon = true,
  align = 'left'
}: ErrorMessageProps) {
  if (!message) return null;

  const styles = {
    error: {
      container: 'bg-red-50 text-red-600',
      icon: <XCircle className="w-5 h-5 flex-shrink-0" />
    },
    warning: {
      container: 'bg-yellow-50 text-yellow-600',
      icon: <AlertTriangle className="w-5 h-5 flex-shrink-0" />
    }
  };

  const { container, icon: SeverityIcon } = styles[severity];
  const alignmentStyles = align === 'center' ? 'text-center' : '';

  return (
    <div className={`${container} p-4 rounded-lg ${alignmentStyles} ${className}`}>
      {title ? (
        <div className={`space-y-1 ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
          <div className="flex items-center gap-2">
            {icon && SeverityIcon}
            <p className="font-medium">{title}</p>
          </div>
          <p className="text-sm">{message}</p>
        </div>
      ) : (
        <div className={`flex ${align === 'center' ? 'justify-center' : ''} gap-3`}>
          {icon && SeverityIcon}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}