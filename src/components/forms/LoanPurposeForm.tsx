import React from 'react';
import { CreditCard, Wallet, Home, ShoppingBag, AlertCircle, HelpCircle } from 'lucide-react';
import type { FormData } from '../../types/form';
import Title from '../ui/Title';
import Description from '../ui/Description';
import SelectOption from '../ui/SelectOption';

const LOAN_PURPOSES = [
  { 
    value: 'debt_consolidation', 
    label: 'Debt Consolidation',
    icon: Wallet,
    description: 'Combine multiple debts into one payment'
  },
  { 
    value: 'credit_card_refi', 
    label: 'Credit Card Refinancing',
    icon: CreditCard,
    description: 'Refinance high-interest credit card debt'
  },
  { 
    value: 'emergency', 
    label: 'Emergency Expenses',
    icon: AlertCircle,
    description: 'Cover unexpected costs or emergencies'
  },
  { 
    value: 'home_improvement', 
    label: 'Home Improvement',
    icon: Home,
    description: 'Renovate or repair your home'
  },
  { 
    value: 'large_purchases', 
    label: 'Large Purchases',
    icon: ShoppingBag,
    description: 'Finance major expenses or purchases'
  },
  { 
    value: 'other', 
    label: 'Other',
    icon: HelpCircle,
    description: 'Other personal expenses'
  }
] as const;

type LoanPurposeFormProps = {
  formData: FormData;
  onSubmit: (data: Partial<FormData>) => void;
};

export default function LoanPurposeForm({ formData, onSubmit }: LoanPurposeFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Title as="h2" className="mb-2">Loan Purpose</Title>
        <Description size="lg">What's the primary reason for this loan?</Description>
      </div>

      <div className="grid gap-3">
        {LOAN_PURPOSES.map(({ value, label, icon, description }) => (
          <SelectOption
            key={value}
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSubmit({ loanPurpose: value })}
          />
        ))}
      </div>
    </div>
  );
}