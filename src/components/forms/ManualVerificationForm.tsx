import React, { useState } from 'react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { useHubspot } from '../../hooks/useHubspot';

// US States array
const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'], ['DC', 'District of Columbia']
] as const;

const stateOptions = [
  { value: '', label: '-- Select your state --' },
  ...US_STATES.map(([code, name]) => ({
    value: code,
    label: name
  }))
];

type ManualVerificationFormProps = {
  formData: FormData;
  loading: boolean;
  error: string | null;
  onSubmit: (data: Partial<FormData>) => Promise<void>;
  onBack: () => void;
};

export default function ManualVerificationForm({
  formData,
  loading,
  error,
  onSubmit,
  onBack
}: ManualVerificationFormProps) {
  const [manualData, setManualData] = useState({
    offerCode: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [zipError, setZipError] = useState<string | null>(null);
  const hubspot = useHubspot();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zipCode') {
      // Only allow numbers and limit to 5 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 5);
      setManualData(prev => ({ ...prev, [name]: numericValue }));
      
      // Validate zip code
      if (numericValue.length > 0 && !/^\d{5}$/.test(numericValue)) {
        setZipError('Please enter a valid 5-digit ZIP code');
      } else {
        setZipError(null);
      }
    } else {
      setManualData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track manual verification submission in HubSpot
    hubspot.trackEvent('manual_verification_submitted', {
      email: formData.email,
      form_step: 'manual_verification',
      first_name: manualData.firstName,
      last_name: manualData.lastName,
      address: manualData.address1,
      city: manualData.city,
      state: manualData.state,
      zip: manualData.zipCode
    });

    await onSubmit(manualData);
  };

  const handleBack = () => {
    // Track return to phone verification in HubSpot
    hubspot.trackEvent('manual_verification_cancelled', {
      email: formData.email,
      form_step: 'manual_verification'
    });

    onBack();
  };

  const isFormValid = () => {
    const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zipCode'];
    return required.every(field => manualData[field as keyof typeof manualData].trim() !== '') 
      && !zipError 
      && /^\d{5}$/.test(manualData.zipCode);
  };

  return (
    <form id="new-form-manual" onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Manual Verification</Title>
        <Description>Please provide additional information to verify your identity</Description>
        <ErrorMessage 
          message="Note: This is an alternative verification method. Your application will be processed as unverified phone number status."
          severity="warning"
          className="mt-4"
        />
      </div>

      <div className="space-y-4">
        <Input
          id="offerCode"
          name="offerCode"
          value={manualData.offerCode}
          onChange={handleChange}
          label="Access Code"
          optional
        />

        <Input
          id="firstName"
          name="firstName"
          value={manualData.firstName}
          onChange={handleChange}
          label="First Name"
          required
        />

        <Input
          id="lastName"
          name="lastName"
          value={manualData.lastName}
          onChange={handleChange}
          label="Last Name"
          required
        />

        <Input
          id="address1"
          name="address1"
          value={manualData.address1}
          onChange={handleChange}
          label="Street Address"
          required
        />

        <Input
          id="address2"
          name="address2"
          value={manualData.address2}
          onChange={handleChange}
          label="Apt/Suite"
          optional
        />

        <Input
          id="city"
          name="city"
          value={manualData.city}
          onChange={handleChange}
          label="City"
          required
        />

        <Select
          id="state"
          name="state"
          value={manualData.state}
          onChange={handleChange}
          options={stateOptions}
          label="State"
          required
        />

        <Input
          id="zipCode"
          name="zipCode"
          value={manualData.zipCode}
          onChange={handleChange}
          label="ZIP Code"
          maxLength={5}
          inputMode="numeric"
          pattern="\d{5}"
          error={zipError}
          required
        />
      </div>

      <ErrorMessage message={error} />

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={loading || !isFormValid()}
          loading={loading}
          loadingText="Verifying..."
          fullWidth
          size="lg"
        >
          Submit
        </Button>

        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          fullWidth
        >
          Try Phone Verification Again
        </Button>
      </div>
    </form>
  );
}