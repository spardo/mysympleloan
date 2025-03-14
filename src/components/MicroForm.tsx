import React, { useState, useEffect } from 'react';
import { formSchema, type FormData } from '../types/form';
import { formatPhoneNumber, validateEmail, validatePhone } from '../utils/validation';
import { FormController } from '../controllers/FormController';
import { storageController } from '../controllers/StorageController';
import { FormRouteManager, FormRouteEnum, type FormRoute, useFormRouting } from '../routes/FormRoutes';
import StartForm from './forms/StartForm';
import LoanPurposeForm from './forms/LoanPurposeForm';
import LoanAmountForm from './forms/LoanAmountForm';
import PropertyStatusForm from './forms/PropertyStatusForm';
import EmploymentStatusForm from './forms/EmploymentStatusForm';
import EmploymentFrequencyForm from './forms/EmploymentFrequencyForm';
import AnnualIncomeForm from './forms/AnnualIncomeForm';
import EducationForm from './forms/EducationForm';
import EmailForm from './forms/EmailForm';
import BirthDateForm from './forms/BirthDateForm';
import ContactInfoForm from './forms/ContactInfoForm';
import PhoneVerificationForm from './forms/PhoneVerificationForm';
import SSNVerificationForm from './forms/SSNVerificationForm';
import SuccessStep from './forms/SuccessStep';
import ProgressBar from './ProgressBar';
import FormHeader from './FormHeader';
import LoadingOverlay from './LoadingOverlay';
import TrustpilotWidget from './TrustpilotWidget';
import TrustedPartners from './TrustedPartners';
import ApplicationBlocked from './forms/ApplicationBlocked';
import ManualVerificationForm from './forms/ManualVerificationForm';
import UnsuccessfulApplication from './forms/UnsuccessfulApplication';
import DeveloperTools from './DeveloperTools';
import SecurityTiles from './SecurityTiles';
import { clientConfig } from '../config/clientConfig';

const MAX_CONTACT_ATTEMPTS = 3;
const SKIP_FREQUENCY_STATUSES = ['not_employed', 'retired', 'other'];

export default function MicroForm() {
  const { currentPath, navigateToRoute } = useFormRouting();
  
  const mockDelay = 5000;
  const delay = async () => {
    await new Promise(resolve => setTimeout(resolve, mockDelay));
  };

  const [formController] = useState(() => new FormController());
  const [routeManager] = useState(() => new FormRouteManager());
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = storageController.getFormData();
    return savedData || {
      email: '',
      phone: '',
      birthDate: '',
      smsConsent: true,
      promoSmsConsent: false,
      smsCode: '',
      ssnLast4: '',
      loanAmount: 5000,
      loanPurpose: '',
      propertyStatus: '',
      employmentFrequency: '',
      employmentStatus: '',
      annualIncome: 50000,
      educationLevel: ''
    };
  });

  const [validationErrors, setValidationErrors] = useState<{
    email: string | null;
    phone: string | null;
  }>({
    email: null,
    phone: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [contactAttempts, setContactAttempts] = useState(0);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [showManualVerification, setShowManualVerification] = useState(false);
  const [marketingParams, setMarketingParams] = useState<Record<string, string>>({});

  const currentStep = routeManager.getCurrentStep(currentPath);

  useEffect(() => {
    storageController.setFormData(formData);
  }, [formData]);

  useEffect(() => {
    if (contactAttempts >= MAX_CONTACT_ATTEMPTS) {
      setShowManualVerification(true);
      navigateToRoute(FormRouteEnum.VERIFY_PHONE);
    }
  }, [contactAttempts, navigateToRoute]);

  useEffect(() => {
    if (verificationAttempts >= MAX_CONTACT_ATTEMPTS) {
      setShowManualVerification(true);
    }
  }, [verificationAttempts]);

  useEffect(() => {
    if (storageController.isApplicationBlocked() && !routeManager.isBlockedRoute(currentPath as FormRoute)) {
      navigateToRoute(FormRouteEnum.BLOCK);
    }
  }, [currentPath, navigateToRoute]);
  
  const handleApplicationSuccess = () => {
    // Store the first name from the contact response
    if (formController.getContactFirstName()) {
      storageController.setContactFirstName(formController.getContactFirstName());
    }

    storageController.setApplicationData({
      timestamp: Date.now(),
      email: formData.email,
      formData: {
        loanAmount: formData.loanAmount,
        loanPurpose: formData.loanPurpose,
        employmentStatus: formData.employmentStatus,
        propertyStatus: formData.propertyStatus,
        educationLevel: formData.educationLevel
      },
      status: 'success'
    });
    storageController.clearFormData();
    storageController.setApplicationSuccess();
    navigateToRoute(FormRouteEnum.SUCCESS);
  };
  
  const handleApplicationOffers = async (offerId: string) => {
    storageController.setApplicationData({
      timestamp: Date.now(),
      email: formData.email,
      formData: {
        loanAmount: formData.loanAmount,
        loanPurpose: formData.loanPurpose,
        employmentStatus: formData.employmentStatus,
        propertyStatus: formData.propertyStatus,
        educationLevel: formData.educationLevel
      },
      status: 'offers'
    });
    storageController.clearFormData();
    storageController.setApplicationOffers();
    
    setLoadingMessage('Loading your offers...');
    
    await delay();
    
    const targetUrl = `https://fiona.com/partner/symple-lending-loans/loans?results=${offerId}&step=results`;
    window.location.href = targetUrl;
  };

  const handleApplicationFailure = () => {
    storageController.setApplicationData({
      timestamp: Date.now(),
      email: formData.email,
      formData: {
        loanAmount: formData.loanAmount,
        loanPurpose: formData.loanPurpose,
        employmentStatus: formData.employmentStatus,
        propertyStatus: formData.propertyStatus,
        educationLevel: formData.educationLevel
      },
      status: 'unsuccessful'
    });
    storageController.clearFormData();
    storageController.setApplicationFailed();
    navigateToRoute(FormRouteEnum.UNSUCCESSFUL);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      setValidationErrors(prev => ({
        ...prev,
        phone: validatePhone(formattedPhone)
      }));
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setValidationErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    } else if (name === 'smsConsent') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else if (name === 'promoSmsConsent') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleConnectBySms = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    
    setValidationErrors({
      email: emailError,
      phone: phoneError
    });
    
    if (emailError || phoneError) {
      return;
    }
    
    setLoading(true);
    setLoadingMessage('Creating secure connection...');
    setError(null);
    
    try {
      const ipAddress = storageController.getUserIp() || '';
      const result = await formController.connectBySms(formData, ipAddress, marketingParams);
      
      if (result.success) {
        storageController.setApplicationSmsCode();
        navigateToRoute(FormRouteEnum.VERIFY_PHONE);
        setContactAttempts(0);
      } else {
        throw new Error(result.error || 'Failed to create connection');
      }
    } catch (err) {
      const newAttempts = contactAttempts + 1;
      setContactAttempts(newAttempts);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage('Verifying SMS code...');
    setError(null);

    try {
      const verifyResult = await formController.verifyCode(formData.smsCode || '', formData);
      
      if (!verifyResult.success) {
        throw new Error(verifyResult.error);
      }

      setLoadingMessage('Checking eligibility...');
      const createResult = await formController.createContact(formData);
      
      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      switch (createResult.status) {
        case 'accepted':
          handleApplicationSuccess();
          break;

        case 'rejected':
          navigateToRoute(FormRouteEnum.VERIFY_SSN);
          break;

        case 'ERROR':
          if (formController.getVerificationAttempts() >= 3) {
            setShowManualVerification(true);
          } else {
            throw new Error(createResult.error || 'Verification failed');
          }
          break;
      }
    } catch (err) {
      setVerificationAttempts(prev => prev + 1);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleManualVerification = async (data: Partial<FormData>) => {
    setLoading(true);
    setLoadingMessage('Verifying information...');
    setError(null);

    try {
      const result = await formController.verifyManually(data);
      
      if (result.success) {
        handleApplicationSuccess();
      } else {
        handleApplicationFailure();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setLoadingMessage('Sending new code...');
    setError(null);

    try {
      const ipAddress = storageController.getUserIp() || '';
      const result = await formController.connectBySms(formData, ipAddress, marketingParams);
      
      if (result.success) {
        setFormData(prev => ({ ...prev, smsCode: '' }));
      } else {
        throw new Error(result.error || 'Failed to send new code');
      }
    } catch (err) {
      const newAttempts = contactAttempts + 1;
      setContactAttempts(newAttempts);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
    
  };

  const handleReenterInfo = () => {
    setFormData(prev => ({ ...prev, smsCode: '' }));
    navigateToRoute(FormRouteEnum.BIRTH_DATE);
  };

  const handleFormStep = (data: Partial<FormData>) => {
    if (currentStep === 0) {
      storageController.setApplicationStarted();
    }

    setFormData(prev => ({ ...prev, ...data }));
    
    if (data.employmentStatus) {
      if (SKIP_FREQUENCY_STATUSES.includes(data.employmentStatus)) {
        setFormData(prev => ({ ...prev, employmentFrequency: 'monthly' }));
        navigateToRoute(FormRouteEnum.ANNUAL_INCOME);
        return;
      }
    }

    const nextRoute = routeManager.getNextRoute(currentStep);
    if (nextRoute) {
      navigateToRoute(nextRoute);
    }
  };

  const handleOffersSubmit = async () => {
    setLoading(true);
    setLoadingMessage('Submitting application...');
    setError(null);

    try {
      const ipAddress = storageController.getUserIp() || '';
      const result = await formController.submitApplication(formData, ipAddress);
      
      if (result.success) {
        await handleApplicationOffers(result.offerId);
      } else {
        handleApplicationFailure();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleBack = () => {
    setError(null);
    const prevRoute = routeManager.getPreviousRoute(currentStep);
    if (prevRoute) {
      navigateToRoute(prevRoute);
    }
  };

  const handleMarketingParams = (params: Record<string, string>) => {
    setMarketingParams(params);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading && <LoadingOverlay message={loadingMessage} />}

      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={routeManager.getTotalSteps()}
        onBack={currentStep >= 2 ? handleBack : undefined}
      />

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <FormHeader />

        <div className="p-6">
          {currentStep === 0 && (
            <StartForm 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 1 && (
            <LoanAmountForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 2 && (
            <LoanPurposeForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 3 && (
            <PropertyStatusForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 4 && (
            <EmploymentStatusForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 5 && (
            <EmploymentFrequencyForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 6 && (
            <AnnualIncomeForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 7 && (
            <EducationForm 
              formData={formData} 
              onSubmit={handleFormStep} 
            />
          )}

          {currentStep === 8 && (
            <EmailForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleFormStep}
              onMarketingParams={handleMarketingParams}
            />
          )}

          {currentStep === 9 && (
            <BirthDateForm
              formData={formData}
              onSubmit={handleFormStep}
            />
          )}

          {currentStep === 10 && (
            <ContactInfoForm
              formData={formData}
              validationErrors={validationErrors}
              loading={loading}
              error={error}
              onChange={handleChange}
              onSubmit={handleConnectBySms}
            />
          )}

          {currentStep === 11 && !showManualVerification && (
            <PhoneVerificationForm
              formData={formData}
              loading={loading}
              error={error}
              onChange={handleChange}
              onSubmit={handleCodeVerification}
              onResendCode={handleResendCode}
              onReenterInfo={handleReenterInfo}
              verificationAttempts={verificationAttempts}
              onManualVerification={() => {
                setError(null);
                setShowManualVerification(true);
              }}
            />
          )}

          {currentStep === 11 && showManualVerification && (
            <ManualVerificationForm
              formData={formData}
              loading={loading}
              error={error}
              onSubmit={handleManualVerification}
              onBack={() => {
                setShowManualVerification(false);
                setVerificationAttempts(0);
                setFormData(prev => ({ ...prev, smsCode: '' }));
              }}
            />
          )}

          {currentStep === 12 && (
            <SSNVerificationForm
              formData={formData}
              loading={loading}
              error={error}
              onChange={handleChange}
              onSubmit={handleOffersSubmit}
            />
          )}

          {currentStep === 13 && <SuccessStep />}

          {currentStep === 14 && <UnsuccessfulApplication />}

          {currentStep === 15 && (
            <ApplicationBlocked blockDuration={30 * 24 * 60 * 60 * 1000} />
          )}
        </div>
      </div>

      {currentStep === 0 && (
        <>
          <div className="mt-8 text-center">
            <TrustpilotWidget size="large" />
          </div>
        </>
      )}

      <SecurityTiles />
      <DeveloperTools formData={formData} />
    </div>
  );
}