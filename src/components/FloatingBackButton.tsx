import React from 'react';
import { ArrowLeft } from 'lucide-react';

type FloatingBackButtonProps = {
  onBack: () => void;
  visible: boolean;
};

export default function FloatingBackButton({ onBack, visible }: FloatingBackButtonProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onBack}
      className="fixed left-4 top-1/4 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white/90 transition-all shadow-sm z-40"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}