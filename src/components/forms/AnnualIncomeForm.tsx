import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import SliderValue from '../ui/SliderValue';
import Disclaimer from '../ui/Disclaimer';

type AnnualIncomeFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function AnnualIncomeForm({ formData, onSubmit }: AnnualIncomeFormProps) {
  const [income, setIncome] = useState(formData.annualIncome);
  const minIncome = 20000;
  const maxIncome = 250000;
  const step = 5000;

  const handleSliderChange = (value: number) => {
    formData.annualIncome = value;
    setIncome(value);
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
    onSubmit({ annualIncome: income });
  };

  const handleIncrement = () => {
    const newValue = Math.min(income + step, maxIncome);
    handleSliderChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(income - step, minIncome);
    handleSliderChange(newValue);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Title as="h2" className="mb-2">Annual Income</Title>
        <Description size="lg">What is your total annual income?</Description>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Decrease income"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          
          <SliderValue
            value={income}
            min={minIncome}
            max={maxIncome}
            formatValue={formatCurrency}
          />
          
          <button
            type="button"
            onClick={handleIncrement}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase income"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <Slider
          value={income}
          min={minIncome}
          max={maxIncome}
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

        <Disclaimer>
          Provide your total available income including wages, retirement, investments, and rental properties. Alimony, child support or separate maintenance is optional and does not need to be included if you do not wish it to be considered as a basis for repaying the loan. Increase any non taxable income or benefits by 25%.
        </Disclaimer>
      </div>
    </div>
  );
}