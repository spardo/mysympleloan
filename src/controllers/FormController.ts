import { createLeadsService } from '../services/leadsFactory';
import type { FormData } from '../types/form';
import { ApiError, type CreateContactResponse } from '../types/api';
import { storageController } from './StorageController';

export type ContactResult = {
  success: boolean;
  status?: 'QUALIFIED' | 'UNQUALIFIED' | 'ERROR';
  error?: string;
};

export class FormController {
  private readonly leadsService: ILeadsService;
  private spinwheelId: string = '';
  private hubspotRecordId: string = '';
  private verificationAttempts: number = 0;

  constructor() {
    this.leadsService = createLeadsService();
  }

  private handleApiError(err: unknown): { success: false; error: string } {
    if (err instanceof ApiError) {
      return { 
        success: false, 
        error: err.status.message 
      };
    }
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'An error occurred' 
    };
  }

  private isSuccessStatus(code: number): boolean {
    return code >= 200 && code < 300;
  }

  async connectBySms(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.leadsService.connectBySms(
        formData.phone,
        formData.email,
        formData.birthDate,
        formData.loanAmount,
        formData.loanPurpose,
        formData.employmentStatus,
        formData.employmentFrequency || '',
        formData.educationLevel,
        formData.annualIncome,
        formData.propertyStatus
      );

      if (this.isSuccessStatus(response.status.code) && response.spinwheelId) {
        this.spinwheelId = response.spinwheelId;
        if (response.hubspotRecordId) {
          this.hubspotRecordId = response.hubspotRecordId;
        }
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'Failed to create connection' 
      };
    } catch (err) {
      return this.handleApiError(err);
    }
  }

  async verifyCode(code: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    if (!this.spinwheelId || !this.hubspotRecordId) {
      return {
        success: false,
        error: 'Missing required verification data'
      };
    }

    try {
      const response = await this.leadsService.verifyCode(
        code,
        this.spinwheelId,
        formData.email,
        this.hubspotRecordId
      );

      return {
        success: this.isSuccessStatus(response.status.code),
        error: this.isSuccessStatus(response.status.code) ? undefined : 'Failed to verify code'
      };
    } catch (err) {
      return this.handleApiError(err);
    }
  }

  async createContact(formData: FormData): Promise<ContactResult> {
    if (!this.spinwheelId || !this.hubspotRecordId) {
      return {
        success: false,
        status: 'ERROR',
        error: 'Missing required contact data'
      };
    }

    try {
      const response = await this.leadsService.createContact(
        this.spinwheelId,
        formData.email,
        this.hubspotRecordId
      );

      // Track verification attempts
      this.verificationAttempts++;

      // Handle qualified status
      if (response.state === 'accepted') {
        return {
          success: true,
          status: 'accepted'
        };
      }

      // Handle unqualified status
      if (response.state === 'rejected') {
        return {
          success: true,
          status: 'rejected'
        };
      }

      // Handle error case
      return {
        success: false,
        status: 'ERROR',
        error: response.status.message || 'Failed to create contact'
      };
    } catch (err) {
      if (err.status && err.status.code === 422) {
        return {
          success: true,
          status: 'rejected'
        };
      }
      
      // Track failed attempt
      this.verificationAttempts++;

      const error = this.handleApiError(err);
      return {
        success: false,
        status: 'ERROR',
        error: error.error
      };
    }
  }

  getVerificationAttempts(): number {
    return this.verificationAttempts;
  }

  async verifyManually(data: Partial<FormData>): Promise<{ success: boolean; error?: string }> {
    if (!data.firstName || !data.lastName || !data.email || 
        !data.address1 || !data.city || !data.state || !data.zipCode) {
      return {
        success: false,
        error: 'Missing required verification data'
      };
    }

    try {
      const response = await this.leadsService.verifyManually(
        data.offerCode || '',
        data.firstName,
        data.lastName,
        data.email,
        data.address1,
        data.city,
        data.state,
        data.zipCode
      );

      return {
        success: this.isSuccessStatus(response.status.code),
        error: this.isSuccessStatus(response.status.code) ? undefined : 'Failed to verify manually'
      };
    } catch (err) {
      return this.handleApiError(err);
    }
  }

  async submitApplication(formData: FormData): Promise<{ success: boolean; error?: string; offerId?: string }> {
    try {
      const ipAddress = storageController.getUserIp() || '';
      const response = await this.leadsService.submitApplication(
        formData.email,
        formData.ssnLast4 || '',
        formData.loanAmount,
        formData.loanPurpose,
        formData.employmentStatus,
        formData.employmentFrequency || '',
        formData.educationLevel,
        formData.annualIncome,
        formData.propertyStatus,
        ipAddress
      );

      return {
        success: this.isSuccessStatus(response.status.code),
        offerId: response.offerId,
        error: this.isSuccessStatus(response.status.code) ? undefined : 'Failed to submit application'
      };
    } catch (err) {
      return this.handleApiError(err);
    }
  }
}