import React from 'react';
import { X } from 'lucide-react';

type DisclosureModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DisclosureModal({ isOpen, onClose }: DisclosureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl max-h-[90vh] w-full relative">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Advertiser Disclosures</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-sm max-w-none space-y-4">
            <p>
              Symple Lending is not a lender and we do not offer financial products directly. Symple Lending does not represent the Financial Institution Providers on our platform other than as a referral source and we do not endorse or recommend particular Financial Institution Providers or products. Symple Lending does not accept applications, make credit decisions, or guarantee a particular result from a financial product offer request. Any Financial Institution Provider will require you to submit an application to them for their consideration before extending a firm offer of credit. We do not issue loan approvals, loan commitments, or make any guarantees on behalf of any Financial Institution Provider and all rates, fees, and terms are presented without guarantee. Rates, fees, and terms are subject to change pursuant to each Financial Institution Provider's discretion and may not be available in all states or for all types of financial products. You may receive loan offers that vary in amount from what you requested. We may also show offers for financial products that vary from the type you requested, such as debt relief, debt settlement, credit repair, or credit monitoring. Financial Institution Providers' privacy policies and/or security practices may differ from those of Symple Lending.
            </p>
            <p>
              We do not connect you with every Financial Institution Provider in the market, so other Financial Institutions and financial products not listed on our platform may be available to you, subject to different terms and conditions, including lower rates. We cannot guarantee the lowest price or best terms available in the market. Your personal financial situation is unique, and it is your responsibility to evaluate the information and content provided before making any financial decisions.
            </p>
            <p>
              We support the principles of the federal Equal Credit Opportunity Act (the "ECOA"). We do not engage in business practices that discriminate on the basis of race, color, religion, national origin, sex, marital status, age (provided the applicant has the capacity to contract), the fact that all or part of the applicant's income derives from a public assistance program, or the fact that the applicant has in good faith exercised any right under the Consumer Credit Protection Act. Similarly, we are committed to compliance with any applicable state and local anti-discrimination laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}