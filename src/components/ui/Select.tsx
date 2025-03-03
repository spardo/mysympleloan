import React, { useState, useEffect } from 'react';
import Label from './Label';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ 
    value: string | number; 
    label: string;
    shortLabel?: string;
  }>;
  error?: string | null;
  label?: string;
  optional?: boolean;
  className?: string;
  useShortLabel?: boolean;
}

export default function Select({
  options,
  error: externalError,
  label,
  optional = false,
  className = '',
  useShortLabel = false,
  id,
  required,
  value,
  onChange,
  onBlur,
  ...props
}: SelectProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const error = externalError || internalError;
  const baseClassName = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200 text-xl font-medium appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22%23666%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] md:bg-[length:1.5rem] bg-[length:0.75rem] bg-[position:right_0.75rem_center] md:bg-[position:right_0.5rem_center] bg-no-repeat pr-6 md:pr-10 truncate";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (!optional && required && (!e.target.value || e.target.value === '')) {
      setInternalError('This field is required');
    } else {
      setInternalError(null);
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalError(null);
    if (onChange) {
      onChange(e);
    }
  };

  const getDisplayLabel = (option: { label: string; shortLabel?: string }) => {
    if (!useShortLabel) return option.label;
    return isMobile ? (option.shortLabel || option.label) : option.label;
  };

  return (
    <div>
      {label && (
        <Label 
          htmlFor={id} 
          optional={optional}
          required={!optional && required}
        >
          {label}
        </Label>
      )}
      <select
        id={id}
        className={`${baseClassName} ${error ? 'border-red-300' : ''} ${className}`}
        required={!optional && required}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      >
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {getDisplayLabel(option)}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}