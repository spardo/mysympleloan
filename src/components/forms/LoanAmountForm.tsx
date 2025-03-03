import React, { useState } from 'react';
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
  const minAmount = 500;
  const maxAmount = 50000;
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Title as="h2" className="mb-2">Loan Amount</Title>
        <Description size="lg">How much would you like to borrow?</Description>
      </div>

      <div className="space-y-6">
        <SliderValue
          value={amount}
          min={minAmount}
          max={maxAmount}
          formatValue={formatCurrency}
        />

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