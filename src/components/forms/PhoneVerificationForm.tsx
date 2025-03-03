import React, { useEffect, useRef } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { FormRouteEnum, useFormRouting } from '../../routes/FormRoutes';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import ActionLink from '../ui/ActionLink';
import { storageController } from '../../controllers/StorageController';
import { useHubspot } from '../../hooks/useHubspot';

type PhoneVerificationFormProps = {
  formData: FormData;
  loading: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResendCode?: () => Promise<void>;
  onReenterInfo?: () => void;
  verificationAttempts: number;
  onManualVerification: () => void;
};

export default function PhoneVerificationForm({
  formData,
  loading,
  error,
  onChange,
  onSubmit,
  onResendCode,
  onReenterInfo,
  verificationAttempts,
  onManualVerification
}: PhoneVerificationFormProps) {
  const { navigateToRoute } = useFormRouting();
  const hubspot = useHubspot();
  
  // Redirect if not successful
  if (!storageController.isApplicationSmsCode()) {
    navigateToRoute(FormRouteEnum.START);
    return null;
  }
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track verification attempt in HubSpot
    hubspot.trackEvent('phone_verification_attempted', {
      email: formData.email,
      form_step: 'phone_verification',
      phone: formData.phone,
      verification_attempts: verificationAttempts
    });

    await onSubmit(e);
  };

  const handleResendCode = async () => {
    if (onResendCode) {
      // Track resend code in HubSpot
      hubspot.trackEvent('verification_code_resent', {
        email: formData.email,
        form_step: 'phone_verification',
        phone: formData.phone,
        verification_attempts: verificationAttempts
      });

      await onResendCode();
    }
  };

  const handleReenterInfo = () => {
    if (onReenterInfo) {
      // Track info reentry in HubSpot
      hubspot.trackEvent('phone_verification_reenter', {
        email: formData.email,
        form_step: 'phone_verification',
        phone: formData.phone,
        verification_attempts: verificationAttempts
      });

      onReenterInfo();
    }
  };

  const handleManualVerification = () => {
    // Track manual verification switch in HubSpot
    hubspot.trackEvent('manual_verification_selected', {
      email: formData.email,
      form_step: 'phone_verification',
      phone: formData.phone,
      verification_attempts: verificationAttempts
    });

    onManualVerification();
  };

  const isValidCode = (code: string) => {
    return /^\d{6}$/.test(code);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  return (
    <>
      <form id="new-form-sms" onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <Title as="h2" className="mb-2">Verify Your Phone</Title>
          <Description size="lg">Enter the 6-digit code sent to your phone</Description>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mobile Phone:</span>
              <span className="font-medium text-gray-900">{formData.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Birth Date:</span>
              <span className="font-medium text-gray-900">{formatDate(formData.birthDate)}</span>
            </div>
          </div>
        </div>
  
        <div>
          <input
            ref={inputRef}
            type="text"
            name="smsCode"
            id="smsCode"
            value={formData.smsCode}
            onChange={onChange}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#b3905e] focus:ring-2 focus:ring-[#b3905e]/20 transition duration-200 text-center text-2xl tracking-widest"
            inputMode="numeric"
            pattern="\d{6}"
          />
        </div>
  
        <ErrorMessage message={error} />
  
        <Button
          type="submit"
          disabled={loading || !isValidCode(formData.smsCode || '')}
          loading={loading}
          loadingText="Verifying..."
          fullWidth
          size="lg"
        >
          Verify
        </Button>
  
      </form>
      
      {verificationAttempts >= 2 && (
        <div className="pt-4 border-t border-gray-200">
          <ErrorMessage 
            message="Having trouble with the verification code? You can try our manual verification process instead."
            severity="warning"
            className="mb-4"
          />
          <Button
            onClick={handleManualVerification}
            variant="outline"
            fullWidth
          >
            Try Manual Verification
          </Button>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <ActionLink
            onClick={handleResendCode}
            icon={RefreshCw}
            align="center"
          >
            Resend verification code
          </ActionLink>

          <ActionLink
            onClick={handleReenterInfo}
            icon={AlertTriangle}
            align="center"
          >
            Update mobile phone/birth date
          </ActionLink>
        </div>
      </div>
    </>
  );
}