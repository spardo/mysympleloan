import React from 'react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';

type SectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
};

export default function Section({ 
  title, 
  isOpen, 
  onToggle, 
  icon, 
  children 
}: SectionProps) {
  return (
    <div className="space-y-2">
      <SectionHeader 
        title={title} 
        isOpen={isOpen} 
        onToggle={onToggle} 
        icon={icon} 
      />
      {isOpen && (
        <div className="bg-gray-50 rounded-lg p-3">
          {children}
        </div>
      )}
    </div>
  );
}