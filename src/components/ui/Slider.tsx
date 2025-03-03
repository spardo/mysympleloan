import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
  formatValue?: (value: number) => string;
  showLimits?: boolean;
}

export default function Slider({
  value,
  min,
  max,
  step,
  onChange,
  className = '',
  formatValue = (value: number) => value.toString(),
  showLimits = false
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#b3905e] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#b3905e] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
      />
      {showLimits && (
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Less than {formatValue(min)}</span>
          <span>More than {formatValue(max)}</span>
        </div>
      )}
    </div>
  );
}