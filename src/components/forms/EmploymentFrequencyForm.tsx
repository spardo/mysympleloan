import React from 'react';
import { Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import SelectOption from '../ui/SelectOption';

const EMPLOYMENT_FREQUENCIES = [
  { 
    value: 'weekly', 
    label: 'Weekly',
    icon: Calendar,
    description: 'Paid once per week'
  },
  { 
    value: 'biweekly', 
    label: 'Biweekly',
    icon: CalendarDays,
    description: 'Paid every two weeks'
  },
  { 
    value: 'twice_monthly', 
    label: 'Twice Monthly',
    icon: CalendarRange,
    description: 'Paid twice per month (e.g., 1st and 15th)'
  },
  { 
    value: 'monthly', 
    label: 'Monthly',
    icon: CalendarClock,
    description: 'Paid once per month'
  }
] as const;

type EmploymentFrequencyFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function EmploymentFrequencyForm({ formData, onSubmit }: EmploymentFrequencyFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Pay Frequency</Title>
        <Description size="lg">How often do you receive your paycheck?</Description>
      </div>

      <div className="grid gap-3">
        {EMPLOYMENT_FREQUENCIES.map(({ value, label, icon, description }) => (
          <SelectOption
            key={value}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSubmit({ employmentFrequency: value })}
          />
        ))}
      </div>
    </div>
  );
}