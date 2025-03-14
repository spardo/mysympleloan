import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { gtm } from '../utils/gtm';

export const FormRouteEnum = {
  START: 'start',
  LOAN_AMOUNT: 'loan-amount',
  LOAN_PURPOSE: 'loan-purpose',
  PROPERTY_STATUS: 'property-status',
  EMPLOYMENT_STATUS: 'employment-status',
  EMPLOYMENT_FREQUENCY: 'employment-frequency',
  ANNUAL_INCOME: 'annual-income',
  EDUCATION: 'education',
  EMAIL: 'email',
  BIRTH_DATE: 'birth-date',
  CONTACT_INFO: 'contact-info',
  VERIFY_PHONE: 'verify-phone',
  VERIFY_SSN: 'verify-ssn',
  SUCCESS: 'success',
  UNSUCCESSFUL: 'unsuccessful',
  BLOCK: 'hold'
} as const;

const PAGE_TITLES = {
  [FormRouteEnum.START]: 'Apply Now',
  [FormRouteEnum.LOAN_AMOUNT]: 'Loan Amount',
  [FormRouteEnum.LOAN_PURPOSE]: 'Loan Purpose',
  [FormRouteEnum.PROPERTY_STATUS]: 'Property Status',
  [FormRouteEnum.EMPLOYMENT_STATUS]: 'Employment Status',
  [FormRouteEnum.EMPLOYMENT_FREQUENCY]: 'Pay Frequency',
  [FormRouteEnum.ANNUAL_INCOME]: 'Annual Income',
  [FormRouteEnum.EDUCATION]: 'Education Level',
  [FormRouteEnum.EMAIL]: 'Email',
  [FormRouteEnum.BIRTH_DATE]: 'Birth Date',
  [FormRouteEnum.CONTACT_INFO]: 'Contact Information',
  [FormRouteEnum.VERIFY_PHONE]: 'Phone Verification',
  [FormRouteEnum.VERIFY_SSN]: 'Identity Verification',
  [FormRouteEnum.SUCCESS]: 'Application Received',
  [FormRouteEnum.UNSUCCESSFUL]: 'Application Status',
  [FormRouteEnum.BLOCK]: 'Application Status'
} as const;

export type FormRoute = typeof FormRouteEnum[keyof typeof FormRouteEnum];

export const formRouteSchema = z.enum([
  FormRouteEnum.START,
  FormRouteEnum.LOAN_AMOUNT,
  FormRouteEnum.LOAN_PURPOSE,
  FormRouteEnum.PROPERTY_STATUS,
  FormRouteEnum.EMPLOYMENT_STATUS,
  FormRouteEnum.EMPLOYMENT_FREQUENCY,
  FormRouteEnum.ANNUAL_INCOME,
  FormRouteEnum.EDUCATION,
  FormRouteEnum.EMAIL,
  FormRouteEnum.BIRTH_DATE,
  FormRouteEnum.CONTACT_INFO,
  FormRouteEnum.VERIFY_PHONE,
  FormRouteEnum.VERIFY_SSN,
  FormRouteEnum.SUCCESS,
  FormRouteEnum.UNSUCCESSFUL,
  FormRouteEnum.BLOCK
]);

export function useFormRouting() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.slice(1) || FormRouteEnum.START;

  const navigateToRoute = (route: FormRoute) => {
    // Update page title
    const pageTitle = PAGE_TITLES[route];
    document.title = `Symple Lending - ${pageTitle}`;

    // Track step progression in GTM
    gtm.trackStepProgress(route);

    navigate(`/${route}`);
  };

  return {
    currentPath,
    navigateToRoute
  };
}

export class FormRouteManager {
  private readonly routes: FormRoute[] = Object.values(FormRouteEnum);

  getCurrentStep(path: string): number {
    const route = path || FormRouteEnum.START;
    return this.routes.indexOf(route as FormRoute);
  }

  getNextRoute(currentStep: number): FormRoute | undefined {
    return this.routes[currentStep + 1];
  }

  getPreviousRoute(currentStep: number): FormRoute | undefined {
    return this.routes[currentStep - 1];
  }

  isValidRoute(route: string): boolean {
    return formRouteSchema.safeParse(route).success;
  }

  getTotalSteps(): number {
    return 12; // Updated number of steps before success/unsuccessful/block routes
  }

  isBlockedRoute(route: FormRoute): boolean {
    return [FormRouteEnum.BLOCK, FormRouteEnum.SUCCESS, FormRouteEnum.UNSUCCESSFUL].includes(route);
  }

  getPageTitle(route: FormRoute): string {
    return PAGE_TITLES[route];
  }
}