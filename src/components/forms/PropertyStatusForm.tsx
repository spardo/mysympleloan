import React from 'react';
import { Home, Building, HelpCircle } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import SelectOption from '../ui/SelectOption';

const PROPERTY_STATUSES = [
  { 
    value: 'own_with_mortgage', 
    label: 'Own',
    icon: Home,
    description: 'You own your home'
  },
  { 
    value: 'rent', 
    label: 'Rent',
    icon: Building,
    description: 'You rent your residence'
  }
] as const;

type PropertyStatusFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function PropertyStatusForm({ formData, onSubmit }: PropertyStatusFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Property Status</Title>
        <Description size="lg">What's your current living situation?</Description>
      </div>

      <div className="grid gap-3">
        {PROPERTY_STATUSES.map(({ value, label, icon, description }) => (
          <SelectOption
            key={value}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSubmit({ propertyStatus: value })}
          />
        ))}
      </div>
    </div>
  );
}