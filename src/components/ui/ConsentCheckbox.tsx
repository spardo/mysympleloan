import React from 'react';

interface ConsentCheckboxProps {
  name: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  required: boolean
}

export default function ConsentCheckbox({ name, id, checked, onChange, children, required = false }: ConsentCheckboxProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={onChange}
            className="w-6 h-6 rounded border-gray-300 text-[#b3905e] focus:ring-[#b3905e] cursor-pointer"
            required={required}
          />
        </div>
        <label htmlFor={id} className="text-sm text-gray-600 cursor-pointer select-none">
          {children}
        </label>
      </div>
    </div>
  );
}