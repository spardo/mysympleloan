import React, { useState, forwardRef } from 'react';
import Input from './Input';
import { validateEmail } from '../../utils/validation';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  label?: string;
  optional?: boolean;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({ 
  value, 
  onChange, 
  error: externalError,
  label = 'Email Address',
  optional = false
}, ref) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const error = externalError || internalError;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setInternalError(validateEmail(e.target.value));
  };

  return (
    <Input
      ref={ref}
      type="email"
      name="email"
      id="email"
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      error={error}
      label={label}
      optional={optional}
      placeholder="your@email.com"
      required={!optional}
    />
  );
});

EmailInput.displayName = 'EmailInput';

export default EmailInput;