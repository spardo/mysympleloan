import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({ message = 'Processing...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <Loader2 className="w-12 h-12 text-[#212d52] animate-spin" />
        <p className="text-gray-700 text-center font-medium">{message}</p>
      </div>
    </div>
  );
}