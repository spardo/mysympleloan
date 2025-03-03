import React, { useState, forwardRef } from 'react';
import Label from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  label?: string;
  optional?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  error: externalError,
  label,
  optional = false,
  className = '',
  id,
  required,
  value,
  onChange,
  onBlur,
  ...props
}, ref) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const error = externalError || internalError;
  const baseClassName = "w-full px-4 py-3 rounded-lg border border-gray-300 text-xl focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200";

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the field is required and empty
    if (!optional && required && !e.target.value) {
      setInternalError('This field is required');
    } else {
      setInternalError(null);
    }

    // Call the original onBlur handler if it exists
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear the internal error when the user starts typing
    setInternalError(null);

    // Call the original onChange handler if it exists
    if (onChange) {
      onChange(e);
    }
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
      <input
        ref={ref}
        id={id}
        className={`${baseClassName} ${error ? 'border-red-300' : ''} ${className}`}
        required={!optional && required}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;