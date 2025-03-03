import React from 'react';

interface SliderValueProps {
  value: number;
  min: number;
  max: number;
  formatValue: (value: number) => string;
  className?: string;
}

export default function SliderValue({
  value,
  min,
  max,
  formatValue,
  className = ''
}: SliderValueProps) {
  const getDisplayValue = (value: number) => {
    if (value === min) {
      return `${formatValue(value)} or less`;
    }
    if (value === max) {
      return `${formatValue(value)} or more`;
    }
    return formatValue(value);
  };

  return (
    <div className={`text-center ${className}`}>
      <span className="text-4xl font-bold text-[#212d52]">
        {getDisplayValue(value)}
      </span>
    </div>
  );
}