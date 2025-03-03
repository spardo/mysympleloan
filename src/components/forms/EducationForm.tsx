import React from 'react';
import { GraduationCap, BookOpen, School, Award, Scroll, Trophy, Lightbulb, Clock, XCircle, HelpCircle } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import SelectOption from '../ui/SelectOption';

const EDUCATION_LEVELS = [
  { 
    value: 'did_not_graduate', 
    label: 'Did Not Graduate',
    icon: XCircle,
    description: 'Did not complete high school'
  },
  { 
    value: 'high_school', 
    label: 'High School',
    icon: School,
    description: 'High school diploma or GED'
  },
  { 
    value: 'still_enrolled', 
    label: 'Currently Enrolled',
    icon: Clock,
    description: 'Currently pursuing a degree'
  },
  { 
    value: 'certificate', 
    label: 'Certificate/Certification',
    icon: Award,
    description: 'Professional certification or trade school'
  },
  { 
    value: 'associate', 
    label: "Associate's Degree",
    icon: Award,
    description: '2-year college degree'
  },
  { 
    value: 'bachelors', 
    label: "Bachelor's Degree",
    icon: GraduationCap,
    description: '4-year college degree'
  },
  { 
    value: 'masters', 
    label: "Master's Degree",
    icon: Scroll,
    description: 'Graduate level degree'
  },
  { 
    value: 'doctorate', 
    label: 'Doctorate',
    icon: Trophy,
    description: 'Ph.D. or other doctoral degree'
  },
  { 
    value: 'other_grad_degree', 
    label: 'Other Graduate Degree',
    icon: Scroll,
    description: 'Other advanced degree'
  },
  { 
    value: 'other', 
    label: 'Other',
    icon: HelpCircle,
    description: 'Other educational background'
  }
] as const;

type EducationFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function EducationForm({ formData, onSubmit }: EducationFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Education Level</Title>
        <Description size="lg">What's your highest level of education?</Description>
      </div>

      <div className="grid gap-3">
        {EDUCATION_LEVELS.map(({ value, label, icon, description }) => (
          <SelectOption
            key={value}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSubmit({ educationLevel: value })}
          />
        ))}
      </div>
    </div>
  );
}