import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DisclosureModal from './DisclosureModal';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
};

export default function ProgressBar({ currentStep, totalSteps, onBack }: ProgressBarProps) {
  const progress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
  const showBackButton = currentStep >= 2 && currentStep <= 11; // Hide back button on success step
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="text-[#212d52] hover:text-[#1a2441] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="text-sm font-medium text-[#212d52]">
            {progress}% Complete
          </span>
        </div>
        <span className="text-sm font-medium text-gray-500">
          <button
            onClick={() => setIsDisclosureOpen(true)}
            className="text-sm text-[#212d52] hover:text-[#1a2441] underline transition-colors"
          >
            Advertiser Disclosures
          </button>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-[#212d52] h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <DisclosureModal
        isOpen={isDisclosureOpen}
        onClose={() => setIsDisclosureOpen(false)}
      />
    </div>
  );
}