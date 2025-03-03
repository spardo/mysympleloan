import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Disclaimer from '../ui/Disclaimer';
import { useHubspot } from '../../hooks/useHubspot';

type SSNVerificationFormProps = {
  formData: FormData;
  loading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function SSNVerificationForm({
  formData,
  loading,
  error,
  onChange,
  onSubmit
}: SSNVerificationFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hubspot = useHubspot();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ssnLast4 && formData.ssnLast4.length === 4) {
      // Track SSN verification in HubSpot
      hubspot.trackEvent('ssn_verification_submitted', {
        email: formData.email,
        form_step: 'ssn_verification'
      });

      onSubmit({ ssnLast4: formData.ssnLast4 });
    }
  };

  const isValidLast4SSN = (ssn: string | undefined) => {
    return ssn ? /^\d{4}$/.test(ssn) : false;
  };

  return (
    <form id="new-form-ssn" onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Verify Your Identity</Title>
        <Description size="lg">Enter the last 4 digits of your Social Security Number</Description>
      </div>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              name="ssnLast4"
              id="ssnLast4"
              value={formData.ssnLast4 || ''}
              onChange={onChange}
              maxLength={4}
              placeholder="Last 4 digits"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200 text-center text-2xl tracking-widest"
              required
              inputMode="numeric"
            />
          </div>
          <div className="mt-4 flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Shield className="w-5 h-5 flex-shrink-0 text-[#b3905e] mt-0.5" />
            <p>
              We use your social security number to validate your information and check your credit. 
              This will NOT affect your credit score. Your information is transmitted securely.
            </p>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />
      
      <Button
        type="submit"
        disabled={loading || !isValidLast4SSN(formData.ssnLast4 || '')}
        loading={loading}
        loadingText="Submitting..."
        fullWidth
        size="lg"
      >
        Submit Application
      </Button>

      <Disclaimer>
        <p className="mb-3">By clicking "Submit Application":</p>
        <ul className="space-y-3">
          <li>
            I consent to the ML Enterprise Inc. (referred to herein as "Engine by MoneyLion", whether doing business as Engine by MoneyLion or through the Symple Lending website){' '}
            <a href="https://web.engine.tech/resources/legal">E-Consent</a>,{' '}
            <a href="https://web.engine.tech/resources/legal">Terms of Service</a>,{' '}
            <a href="https://web.engine.tech/resources/legal">Privacy Policy</a> and{' '}
            <a href="https://web.engine.tech/resources/legal">Financial Privacy Notice</a>.
          </li>
          <li>
            I consent to Engine by MoneyLion's Credit Authorization, which authorizes Engine by MoneyLion and its marketplace partners to obtain consumer report information about me from consumer reporting agencies, now, and periodically in the future, for the purpose of providing me with personalized offers for financial products and services.
          </li>
          <li>
            I direct Engine by MoneyLion to share my information, including consumer report information, with me and with Engine by MoneyLion affiliates and marketplace partners to provide me with financial recommendations or other offers, which may also include debt relief, credit repair, credit monitoring or other related services.
          </li>
        </ul>
      </Disclaimer>
    </form>
  );
}