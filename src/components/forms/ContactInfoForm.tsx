import React, { useState, useEffect, useRef } from 'react';
import { XCircle } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import PhoneInput from '../ui/PhoneInput';
import ConsentCheckbox from '../ui/ConsentCheckbox';
import Disclaimer from '../ui/Disclaimer';

type ContactInfoFormProps = {
  formData: FormData;
  validationErrors: {
    email: string | null;
    phone: string | null;
  };
  loading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export default function ContactInfoForm({
  formData,
  validationErrors,
  loading,
  error,
  onChange,
  onSubmit
}: ContactInfoFormProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the phone input when the component mounts
    phoneInputRef.current?.focus();
  }, []);

  const handlePhoneChange = (value: string) => {
    onChange({
      target: {
        name: 'phone',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...e,
      target: {
        ...e.target,
        name: 'smsConsent',
        value: e.target.checked.toString()
      }
    });
  };

  const handlePromoCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...e,
      target: {
        ...e.target,
        name: 'promoSmsConsent',
        value: e.target.checked.toString()
      }
    });
  };

  const isFormValid = () => {
    return (
      formData.phone &&
      formData.smsConsent === true &&
      !validationErrors.phone
    );
  };

  return (
    <form id="new-form-phone" onSubmit={onSubmit} className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Finally, Verify Your Phone</Title>
        <Description size="lg">To ensure it is really you, we'll text a one-time passcode to your mobile phone.</Description>
      </div>

      <div className="space-y-4">
        <PhoneInput
          ref={phoneInputRef}
          value={formData.phone || ''}
          onChange={handlePhoneChange}
          error={validationErrors.phone}
          label="Mobile Phone"
          required
        />

        <ConsentCheckbox
          name="LEGAL_CONSENT.subscription_type_283760521"
          id="LEGAL_CONSENT.subscription_type_283760521-387e98ab-c7d6-4730-bf86-38cda34d7642"
          checked={formData.smsConsent || false}
          onChange={handleCheckboxChange}
          required={true}
        >
          I agree to receive SMS messages from Symple Lending regarding application updates and account-related communications.
        </ConsentCheckbox>

        <ConsentCheckbox
          name="promoSmsConsent"
          id="promoSmsConsent"
          checked={formData.promoSmsConsent || false}
          onChange={handlePromoCheckboxChange}
        >
          (Optional) I agree to receive SMS messages from Symple Lending regarding product updates and related promotional offers. Message and data rates may apply. Message frequency varies. Reply HELP for assistance or STOP to cancel.
        </ConsentCheckbox>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !isFormValid()}
        loading={loading}
        loadingText="Processing..."
        fullWidth
        size="lg"
      >
        Send Verification Code
      </Button>

      <Disclaimer>
        By continuing, you provide Symple Lending and Spinwheel Solutions, Inc. express written consent to obtain your credit report for application purposes. You agree to Symple Lending's{' '}
        <a href="https://symplelending.com/terms-of-use" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>,{' '}
        <a href="https://symplelending.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>,{' '}
        <a href="https://legal.spinwheel.io/end-user-agreement/" target="_blank" rel="noopener noreferrer">
          Spinwheel End User Agreement
        </a>{' '}
        and authorize Spinwheel Solutions, Inc. to retrieve your credit profile from any consumer reporting agency.
      </Disclaimer>
    </form>
  );
}