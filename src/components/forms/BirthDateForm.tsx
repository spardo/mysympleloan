import React, { useState } from 'react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import DatePicker from '../ui/DatePicker';
import { validateBirthDate } from '../../utils/validation';
import { useHubspot } from '../../hooks/useHubspot';

type BirthDateFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function BirthDateForm({ formData, onSubmit }: BirthDateFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [localDate, setLocalDate] = useState(formData.birthDate);
  const hubspot = useHubspot();

  const handleDateChange = (value: string) => {
    const dateError = validateBirthDate(value);
    setError(dateError);
    setLocalDate(value);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localDate) {
      setError('Please enter your date of birth');
      return;
    }

    const dateError = validateBirthDate(localDate);
    if (dateError) {
      setError(dateError);
      return;
    }

    // Track birth date in HubSpot
    hubspot.identify({
      email: formData.email,
      date_of_birth: localDate,
      date_of_birth__c: localDate,
      sensitive_date_of_birth: localDate
    });

    // Track form step completion
    hubspot.trackEvent('birth_date_step_completed', {
      email: formData.email,
      form_step: 'birthdate',
      date_of_birth: localDate,
      date_of_birth__c: localDate,
      sensitive_date_of_birth: localDate
    });

    onSubmit({ birthDate: localDate });
  };

  return (
    <form id="new-form-date" onSubmit={handleContinue} className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">When were you born?</Title>
        <Description size="lg">You must be at least 18 years old to apply</Description>
      </div>

      <DatePicker
        value={localDate}
        onChange={handleDateChange}
        error={error}
        defaultOption="empty"
      />

      {/* Hidden fields */}
      <input 
        type="hidden" 
        name="email" 
        value={formData.email} 
        data-hs-field-hidden="true"
      />
      <input 
        type="hidden" 
        name="date_of_birth" 
        value={localDate} 
        data-hs-field-hidden="true"
      />
      <input 
        type="hidden" 
        name="date_of_birth__c" 
        value={localDate} 
        data-hs-field-hidden="true"
      />
      <input 
        type="hidden" 
        name="sensitive_date_of_birth" 
        value={localDate} 
        data-hs-field-hidden="true"
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!localDate || !!error}
      >
        Continue
      </Button>
    </form>
  );
}