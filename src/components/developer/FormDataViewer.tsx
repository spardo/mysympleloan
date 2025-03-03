import React from 'react';

type FormDataViewerProps = {
  formData: Record<string, any>;
  formatValue: (key: string, value: any) => string;
};

const DATA_CATEGORIES = {
  'Personal Information': [
    'email',
    'phone',
    'birthDate',
    'firstName',
    'lastName',
    'ssnLast4'
  ],
  'Loan Details': [
    'loanAmount',
    'loanPurpose',
    'propertyStatus',
    'employmentStatus',
    'annualIncome',
    'educationLevel'
  ],
  'Address Information': [
    'address1',
    'address2',
    'city',
    'state',
    'zipCode'
  ],
  'Consent & Verification': [
    'smsConsent',
    'promoSmsConsent',
    'smsCode',
    'offerCode'
  ],
  'Marketing Data': [
    'gclid',
    'fbclid',
    'ttclid',
    'msclkid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'referrer',
    'landing_page',
    'affiliate_id',
    'partner_id',
    'sub_id'
  ]
};

export default function FormDataViewer({ formData, formatValue }: FormDataViewerProps) {
  const renderCategory = (category: string, fields: string[]) => {
    const hasData = fields.some(field => formData[field] !== undefined);
    if (!hasData) return null;

    return (
      <div key={category} className="space-y-3">
        <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-1">
          {category}
        </h3>
        <div className="space-y-2">
          {fields.map(field => {
            if (formData[field] === undefined) return null;
            return (
              <div key={field} className="space-y-1">
                <div className="font-medium text-gray-700">{field}</div>
                <div 
                  className="font-mono text-gray-600 break-all whitespace-pre-wrap bg-gray-50 p-2 rounded"
                >
                  {formatValue(field, formData[field])}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-sm">
      {Object.entries(DATA_CATEGORIES).map(([category, fields]) => 
        renderCategory(category, fields)
      )}
      
      {Object.keys(formData).length === 0 && (
        <div className="text-gray-500 italic text-center">
          No form data collected yet
        </div>
      )}
    </div>
  );
}