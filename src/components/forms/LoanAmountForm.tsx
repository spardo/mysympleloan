import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import SliderValue from '../ui/SliderValue';

type LoanAmountFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function LoanAmountForm({ formData, onSubmit }: LoanAmountFormProps) {
  const [amount, setAmount] = useState(formData.loanAmount);
  const minAmount = 1000;
  const maxAmount = 100000;
  const step = 500;

  const handleSliderChange = (value: number) => {
    formData.loanAmount = value;
    setAmount(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = () => {
    onSubmit({ loanAmount: amount });
  };

  const handleIncrement = () => {
    const newValue = Math.min(amount + step, maxAmount);
    handleSliderChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(amount - step, minAmount);
    handleSliderChange(newValue);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Title as="h2" className="mb-2">Loan Amount</Title>
        <Description size="lg">How much would you like to borrow?</Description>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Decrease amount"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          
          <SliderValue
            value={amount}
            min={minAmount}
            max={maxAmount}
            formatValue={formatCurrency}
          />
          
          <button
            type="button"
            onClick={handleIncrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase amount"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <Slider
          value={amount}
          min={minAmount}
          max={maxAmount}
          step={step}
          onChange={handleSliderChange}
          formatValue={formatCurrency}
          showLimits
        />

        <Button
          onClick={handleSubmit}
          fullWidth
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}