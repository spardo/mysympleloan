import React from 'react';
import { Shield, Clock, ThumbsUp } from 'lucide-react';
import type { FormData } from '../../types/form';
import Button from '../ui/Button';
import Title from '../ui/Title';
import Description from '../ui/Description';
import Disclaimer from '../ui/Disclaimer';
import TrustpilotWidget from '../TrustpilotWidget';

type StartFormProps = {
  onSubmit: (data: Partial<FormData>) => void;
};

export default function StartForm({ onSubmit }: StartFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  const TrustIndicator = ({ icon: Icon, label }: { icon: typeof Shield; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-[#212d52]/10 rounded-full flex items-center justify-center mb-2">
        <Icon className="w-5 h-5 text-[#212d52]" />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <Title className="mb-2">Get your Personal Loan in minutes</Title>
        <Description size="lg" className="mb-4">
          Check your rate with no impact to your credit score
        </Description>
        
        <div className="mb-6">
          <TrustpilotWidget size="medium" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <TrustIndicator icon={Clock} label="2 Minutes" />
          <TrustIndicator icon={Shield} label="Safe & Secure" />
          <TrustIndicator icon={ThumbsUp} label="Multiple Offers" />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
      >
        Check Your Rate
      </Button>

      <Disclaimer>
        All website interactions and phone calls are recorded for marketing, compliance and quality assurance purposes. By clicking "Check Your Rate" or by using this website, you accept and agree to our{' '}
        <a href="https://symplelending.com/terms-of-use">Terms and Conditions</a>, including our agreement to arbitrate any disputes, and our{' '}
        <a href="https://symplelending.com/privacy-policy">Privacy Policy</a>, including the provisions regarding accepting or avoiding cookies.
      </Disclaimer>
    </form>
  );
}