import React, { useState, useEffect } from 'react';
import { Check, Loader2, ClipboardCheck, Search, PhoneCall } from 'lucide-react';

type Stage = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  minDuration: number;
  maxDuration: number;
};

const STAGES: Stage[] = [
  {
    id: 'assigned',
    label: 'Application Assigned',
    icon: <ClipboardCheck className="w-6 h-6" />,
    description: 'Your application has been assigned to a loan specialist',
    minDuration: 4000,  // 4 seconds
    maxDuration: 6000   // 6 seconds
  },
  {
    id: 'reviewing',
    label: 'Under Review',
    icon: <Search className="w-6 h-6" />,
    description: 'We are reviewing your information',
    minDuration: 8000,  // 8 seconds
    maxDuration: 12000  // 12 seconds
  },
  {
    id: 'ready',
    label: 'Results Ready',
    icon: <Check className="w-6 h-6" />,
    description: 'Your loan results are ready',
    minDuration: 5000,  // 5 seconds
    maxDuration: 7000   // 7 seconds
  },
  {
    id: 'contact',
    label: 'Contact Attempted',
    icon: <PhoneCall className="w-6 h-6" />,
    description: 'Our team is trying to reach you',
    minDuration: 15000, // 15 seconds
    maxDuration: 20000  // 20 seconds
  }
];

export default function ApplicationProgress() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const moveToNextStage = () => {
      if (currentStageIndex < STAGES.length - 1) {
        const currentStage = STAGES[currentStageIndex];
        const delay = Math.floor(
          Math.random() * (currentStage.maxDuration - currentStage.minDuration + 1) + 
          currentStage.minDuration
        );

        setTimeout(() => {
          setCurrentStageIndex(prev => prev + 1);
        }, delay);
      } else {
        setIsComplete(true);
      }
    };

    if (!isComplete) {
      moveToNextStage();
    }
  }, [currentStageIndex, isComplete]);

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
        <div className="text-sm text-gray-500">
          Stage {currentStageIndex + 1} of {STAGES.length}
        </div>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                isActive ? 'bg-[#b3905e]/10' : 'bg-gray-50'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isCompleted ? 'bg-green-500 text-white' : 
                  isActive ? 'bg-[#b3905e] text-white' : 
                  'bg-gray-200 text-gray-400'}
              `}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  stage.icon
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    isPending ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {stage.label}
                  </p>
                  {isCompleted && (
                    <span className="text-green-500 text-sm">Complete</span>
                  )}
                </div>
                <p className={`text-sm ${
                  isPending ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}