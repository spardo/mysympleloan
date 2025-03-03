import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SelectOptionProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export default function SelectOption({
  icon: Icon,
  label,
  description,
  onClick,
  className = ''
}: SelectOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-[#b3905e] hover:bg-[#b3905e]/5 focus:outline-none focus:ring-4 focus:ring-[#b3905e]/20 transition duration-200 group ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#b3905e]/10 flex items-center justify-center group-hover:bg-[#b3905e]/20 transition-colors flex-shrink-0">
          <Icon className="w-5 h-5 text-[#b3905e]" />
        </div>
        <div>
          <span className="font-medium text-gray-900 block mb-1">{label}</span>
          <span className="text-sm text-gray-600">{description}</span>
        </div>
      </div>
    </button>
  );
}