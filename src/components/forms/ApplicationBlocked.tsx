import React, { useState } from 'react';
import { AlertTriangle, Calendar, BanknoteIcon, Briefcase, GraduationCap, Home, RefreshCcw, ExternalLink, Phone } from 'lucide-react';
import { storageController } from '../../controllers/StorageController';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import Title from '../ui/Title';
import Description from '../ui/Description';
import ActionLink from '../ui/ActionLink';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';

const phoneNumber = '(855) 303-1455';
const phoneNumberLink = 'tel:8553031455';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getLoanPurpose = (value: string) => {
  const purposes = {
    'debt_consolidation': 'Debt Consolidation',
    'credit_card_refi': 'Credit Card Refinancing',
    'emergency': 'Emergency Expenses',
    'home_improvement': 'Home Improvement',
    'large_purchases': 'Large Purchases',
    'other': 'Other'
  };
  return purposes[value as keyof typeof purposes] || 'Not specified';
};

const getEmploymentStatus = (value: string) => {
  const statuses = {
    'employed': 'Employed',
    'employed_full_time': 'Full-Time Employed',
    'employed_part_time': 'Part-Time Employed',
    'military': 'Military',
    'not_employed': 'Not Employed',
    'self_employed': 'Self-Employed',
    'retired': 'Retired',
    'other': 'Other'
  };
  return statuses[value as keyof typeof statuses] || 'Not specified';
};

const getPropertyStatus = (value: string) => {
  const statuses = {
    'own_with_mortgage': 'Own with Mortgage',
    'rent': 'Rent'
  };
  return statuses[value as keyof typeof statuses] || 'Not specified';
};

const getEducationLevel = (value: string) => {
  const levels = {
    'high_school': 'High School or GED',
    'associate': "Associate's Degree",
    'bachelors': "Bachelor's Degree",
    'masters': "Master's Degree",
    'doctorate': 'Doctorate',
    'other_grad_degree': 'Other Graduate Degree',
    'certificate': 'Certificate/Certification',
    'did_not_graduate': 'Did Not Graduate',
    'still_enrolled': 'Currently Enrolled',
    'other': 'Other'
  };
  return levels[value as keyof typeof levels] || 'Not specified';
};

export default function ApplicationBlocked() {
  const [showWarning, setShowWarning] = useState(false);
  const applicationData = storageController.getApplicationData();
  const daysRemaining = storageController.getBlockTimeRemaining();
  const isSuccessful = storageController.isApplicationSuccessful();
  const navigate = useNavigate();
  
  const expirationDate = applicationData ? new Date(applicationData.timestamp + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  const handleClearStorage = () => {
    if (showWarning) {
      storageController.clearAll();
      navigate('/start');
    } else {
      setShowWarning(true);
    }
  };

  if (applicationData?.status === 'unsuccessful') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <div>
          <Title as="h2" className="mb-2">Application Unsuccessful</Title>
          <Description>
            We were unable to verify your information. You can try again after {expirationDate}.
          </Description>
        </div>

        <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md p-4">
          <a 
            href="https://fiona.com/partner/symple-lending-loans/loans"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#212d52] text-white rounded-lg hover:bg-[#1a2441] transition-colors font-semibold text-lg group"
          >
            Check MoneyLion Offers
            <ExternalLink className="w-5 h-5 transition-transform group-hover:scale-110" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8 text-yellow-600" />
      </div>

      <div>
        <Title as="h2" className="mb-2">Application Already Submitted</Title>
        <Description>
          You've already submitted a loan application with the email address{' '}
          <span className="font-medium">{applicationData?.email}</span>. 
          Please wait {daysRemaining} days before submitting a new application.
        </Description>
      </div>

      {isSuccessful && (
        <div className="w-full md:w-1/2 mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <Description className="text-center">
              For immediate assistance, call us at
            </Description>
            
            <Button
              as="a"
              href={phoneNumberLink}
              variant="primary"
              size="lg"
              fullWidth
              icon={<Phone className="w-5 h-5" />}
            >
              {phoneNumber}
            </Button>
          </div>
        </div>
      )}
      
      {applicationData?.formData && (
        <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Previous Application Details</h3>
          
          <div className="space-y-4">
            {applicationData.formData.loanAmount && (
              <div className="flex items-center gap-3">
                <BanknoteIcon className="w-5 h-5 text-[#212d52]" />
                <div>
                  <div className="text-sm text-gray-600">Loan Amount</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(applicationData.formData.loanAmount)}
                  </div>
                </div>
              </div>
            )}

            {applicationData.formData.loanPurpose && (
              <div className="flex items-center gap-3">
                <BanknoteIcon className="w-5 h-5 text-[#212d52]" />
                <div>
                  <div className="text-sm text-gray-600">Loan Purpose</div>
                  <div className="font-medium text-gray-900">
                    {getLoanPurpose(applicationData.formData.loanPurpose)}
                  </div>
                </div>
              </div>
            )}

            {applicationData.formData.employmentStatus && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-[#212d52]" />
                <div>
                  <div className="text-sm text-gray-600">Employment Status</div>
                  <div className="font-medium text-gray-900">
                    {getEmploymentStatus(applicationData.formData.employmentStatus)}
                  </div>
                </div>
              </div>
            )}

            {applicationData.formData.propertyStatus && (
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-[#212d52]" />
                <div>
                  <div className="text-sm text-gray-600">Property Status</div>
                  <div className="font-medium text-gray-900">
                    {getPropertyStatus(applicationData.formData.propertyStatus)}
                  </div>
                </div>
              </div>
            )}

            {applicationData.formData.educationLevel && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#212d52]" />
                <div>
                  <div className="text-sm text-gray-600">Education Level</div>
                  <div className="font-medium text-gray-900">
                    {getEducationLevel(applicationData.formData.educationLevel)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg inline-flex items-center gap-3 mx-auto">
        <Calendar className="w-5 h-5 text-[#212d52]" />
        <span className="text-gray-700">
          You can apply again after <span className="font-medium">{expirationDate}</span>
        </span>
      </div>

      {showWarning ? (
        <div className="space-y-4">
          <ErrorMessage
            title="Warning!"
            message="Starting a new application before the waiting period expires may result in delays or complications with your existing application. Are you sure you want to proceed?"
            severity="error"
            align="center"
          />
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleClearStorage}
              variant="danger"
              icon={<RefreshCcw className="w-4 h-4" />}
            >
              Yes, start new application
            </Button>
            <Button
              onClick={() => setShowWarning(false)}
              variant="muted"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <ActionLink
            onClick={handleClearStorage}
            icon={RefreshCcw}
            align="center"
            className="block"
          >
            Start new application
          </ActionLink>
        </div>
      )}

    </div>
  );
}