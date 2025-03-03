import React from 'react';
import { Logo } from './Logo';

export default function FormHeader() {
  return (
    <div className="bg-[#212d52] p-4 sm:p-6 text-white">
      <div className="flex justify-center">
        <div className="h-8 sm:h-12">
          <Logo className="h-full" />
        </div>
      </div>
    </div>
  );
}