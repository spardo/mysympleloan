import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SectionHeaderProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
};

export default function SectionHeader({ 
  title, 
  isOpen, 
  onToggle, 
  icon: Icon 
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:text-[#212d52]"
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {title}
      </span>
      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  );
}