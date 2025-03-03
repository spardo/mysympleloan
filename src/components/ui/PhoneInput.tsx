import React, { useState, forwardRef } from 'react';
import { formatPhoneNumber, validatePhone } from '../../utils/validation';
import Label from './Label';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  label?: string;
  optional?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ 
  value = '', 
  onChange, 
  error: externalError,
  label = 'Mobile Phone',
  optional = false
}, ref) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const error = externalError || internalError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    onChange(formattedPhone);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setInternalError(validatePhone(e.target.value));
  };

  return (
    <div>
      <Label 
        htmlFor="phone" 
        optional={optional}
        required={!optional}
      >
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 pr-3 border-r border-gray-200">
          <img 
            src="https://flagcdn.com/w20/us.png"
            srcSet="https://flagcdn.com/w40/us.png 2x"
            width="20"
            height="15"
            alt="United States"
            className="rounded-sm"
          />
          <span className="text-xl">+1</span>
        </div>
        <input
          ref={ref}
          type="tel"
          name="phone"
          id="phone"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full pl-[5.5rem] pr-4 py-3 rounded-lg border ${
            error ? 'border-red-300' : 'border-gray-300'
          } text-xl focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200`}
          placeholder="(555) 555-5555"
          maxLength={14}
          required={!optional}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;