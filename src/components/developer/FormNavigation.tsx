import React from 'react';
import { Navigation } from 'lucide-react';
import { FormRouteEnum } from '../../routes/FormRoutes';
import { storageController } from '../../controllers/StorageController';

type FormNavigationProps = {
  onNavigate: (route: string) => void;
};

const FORM_ROUTES = [
  { value: FormRouteEnum.START, label: 'Start' },
  { value: FormRouteEnum.LOAN_AMOUNT, label: 'Loan Amount' },
  { value: FormRouteEnum.LOAN_PURPOSE, label: 'Loan Purpose' },
  { value: FormRouteEnum.PROPERTY_STATUS, label: 'Property Status' },
  { value: FormRouteEnum.EMPLOYMENT_STATUS, label: 'Employment Status' },
  { value: FormRouteEnum.ANNUAL_INCOME, label: 'Annual Income' },
  { value: FormRouteEnum.EDUCATION, label: 'Education' },
  { value: FormRouteEnum.EMAIL, label: 'Email' },
  { value: FormRouteEnum.BIRTH_DATE, label: 'Birth Date' },
  { value: FormRouteEnum.CONTACT_INFO, label: 'Contact Info' },
  { value: FormRouteEnum.VERIFY_PHONE, label: 'Verify Phone' },
  { value: FormRouteEnum.VERIFY_SSN, label: 'Verify SSN' },
  { value: FormRouteEnum.SUCCESS, label: 'Successful' },
  { value: FormRouteEnum.UNSUCCESSFUL, label: 'Unsuccessful' },
  { value: FormRouteEnum.BLOCK, label: 'Block' }
];

export default function FormNavigation({ onNavigate }: FormNavigationProps) {
  const applicationStatus = storageController.getApplicationStatus();

  return (
    <div className="space-y-2 text-sm">
      <select
        onChange={(e) => onNavigate(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 text-sm focus:border-[#212d52] focus:ring-2 focus:ring-[#212d52]/20 transition-colors"
      >
        <option value="">-- Select a form step --</option>
        {FORM_ROUTES.map(route => (
          <option key={route.value} value={route.value}>
            {route.label}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-4 h-4" />
          <span>Quick navigation between form steps</span>
        </div>
        {applicationStatus && (
          <div className={`px-2 py-0.5 rounded-full font-medium ${
            applicationStatus === 'success' ? 'bg-green-50 text-green-600' :
            applicationStatus === 'failed' ? 'bg-red-50 text-red-600' :
            applicationStatus === 'started' ? 'bg-yellow-50 text-yellow-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
}