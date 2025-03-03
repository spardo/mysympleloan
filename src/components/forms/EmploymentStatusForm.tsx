import React from 'react';
import { Briefcase, Building2, Shield, Sunset, SearchX, HelpCircle, Clock } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import SelectOption from '../ui/SelectOption';

const EMPLOYMENT_STATUSES = [
  // Full-time employment (most common)
  { 
    value: 'employed_full_time', 
    label: 'Full-Time Employed',
    icon: Briefcase,
    description: '40+ hours per week'
  },
  // Part-time employment
  { 
    value: 'employed_part_time', 
    label: 'Part-Time Employed',
    icon: Clock,
    description: 'Less than 40 hours per week'
  },
  // Self-employment
  { 
    value: 'self_employed', 
    label: 'Self-Employed',
    icon: Building2,
    description: 'Business owner or freelancer'
  },
  // Military service
  { 
    value: 'military', 
    label: 'Military',
    icon: Shield,
    description: 'Active duty or reserve military service'
  },
  // General employment (fallback)
  { 
    value: 'employed', 
    label: 'Other Employment',
    icon: Briefcase,
    description: 'Other employment arrangement'
  },
  // Non-working statuses
  { 
    value: 'retired', 
    label: 'Retired',
    icon: Sunset,
    description: 'Receiving retirement income'
  },
  { 
    value: 'not_employed', 
    label: 'Not Currently Employed',
    icon: SearchX,
    description: 'Not working at this time'
  },
  // Other (least common)
  { 
    value: 'other', 
    label: 'Other',
    icon: HelpCircle,
    description: 'None of the above'
  }
] as const;

type EmploymentStatusFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function EmploymentStatusForm({ formData, onSubmit }: EmploymentStatusFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Employment Status</Title>
        <Description size="lg">What best describes your current employment?</Description>
      </div>

      <div className="grid gap-3">
        {EMPLOYMENT_STATUSES.map(({ value, label, icon, description }) => (
          <SelectOption
            key={value}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSubmit({ employmentStatus: value })}
          />
        ))}
      </div>
    </div>
  );
}