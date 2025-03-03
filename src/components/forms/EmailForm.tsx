import React, { useState, useEffect, useRef } from 'react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import EmailInput from '../ui/EmailInput';
import { useHubspot } from '../../hooks/useHubspot';
import { clientConfig } from '../../config/clientConfig';

// Marketing tracking parameters
const MARKETING_PARAMS = {
  lead_source_code__c: '',
  // Google Ads
  gclid: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  // Meta (Facebook)
  fbclid: '',
  fb_source: '',
  // TikTok
  ttclid: '',
  // Microsoft Ads
  msclkid: '',
  // Generic
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
  referrer: '',
  landing_page: '',
  // Custom
  affiliate_id: '',
  partner_id: '',
  sub_id: '',
  placement: '',
  creative: '',
  device: '',
  matchtype: '',
  network: '',
  target: '',
  position: '',
  loc_physical_ms: '',
  loc_interest_ms: '',
  platform: '',
  // Disclosed  
  loan_amount: '0',
  loan_purpose: '',
  property_status: '',
  employment_status: '',
  employment_pay_frequency: '',
  annual_income__c: '0',
  engine_annual_income: '',
  education_level: ''
};

type MarketingParams = typeof MARKETING_PARAMS;

type EmailFormProps = {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function EmailForm({ formData, onChange, onSubmit }: EmailFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [marketingParams, setMarketingParams] = useState<MarketingParams>(MARKETING_PARAMS);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const hubspot = useHubspot();
  
  useEffect(() => {
    // Focus the email input when the component mounts
    emailInputRef.current?.focus();

    // Collect marketing parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const newParams = { ...MARKETING_PARAMS };
    
    // Collect all marketing parameters from URL
    Object.keys(MARKETING_PARAMS).forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        newParams[param as keyof MarketingParams] = value;
      }
    });

    newParams.lead_source_code__c = clientConfig.domainType;
    
    // Add disclosed form data
    newParams.loan_amount = formData.loanAmount.toString();
    newParams.loan_purpose = formData.loanPurpose;
    newParams.property_status = formData.propertyStatus;
    newParams.employment_status = formData.employmentStatus;
    newParams.employment_pay_frequency = formData.employmentFrequency;
    newParams.annual_income__c = formData.annualIncome.toString();
    newParams.engine_annual_income = formData.annualIncome.toString();
    newParams.education_level = formData.educationLevel;
    
    // Add referrer and landing page
    newParams.referrer = document.referrer;
    newParams.landing_page = window.location.pathname + window.location.search;

    // Add device and platform info
    newParams.device = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) 
      ? 'mobile' 
      : 'desktop';
    newParams.platform = navigator.platform;

    setMarketingParams(newParams);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    // Track email submission in HubSpot
    hubspot.identify({
      email: formData.email,
      ...marketingParams
    });

    // Track form step completion
    hubspot.trackEvent('email_step_completed', {
      email: formData.email,
      form_step: 'email',
      ...marketingParams
    });

    onSubmit({ email: formData.email });
  };

  return (
    <form id="new-form-email" name="new-form-email" onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">What's your email?</Title>
        <Description size="lg">We'll use this to send you important updates about your application</Description>
      </div>

      <EmailInput
        ref={emailInputRef}
        value={formData.email}
        onChange={onChange}
        error={error}
      />

      {/* Hidden marketing tracking fields */}
      {Object.entries(marketingParams).map(([key, value]) => (
        <input
          key={key}
          type="hidden"
          name={key}
          value={value}
          data-hs-field-hidden="true"
        />
      ))}

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={!formData.email}
      >
        Continue
      </Button>
    </form>
  );
}