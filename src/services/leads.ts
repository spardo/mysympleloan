import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  connectResponseSchema, 
  createContactResponseSchema,
  verifyManuallyResponseSchema,
  submitApplicationResponseSchema,
  type ConnectResponse, 
  type CreateContactResponse,
  type VerifyManuallyResponse,
  type SubmitApplicationResponse,
  ApiError 
} from '../types/api';
import type { FormData } from '../types/form';
import { formatE164 } from '../utils/validation';

export interface ILeadsService {
  connectBySms(
    phoneNumber: string, 
    email: string, 
    dateOfBirth: string,
    loanAmount: number,
    loanPurpose: string,
    employmentStatus: string,
    employmentFrequency: string,
    educationLevel: string,
    annualIncome: number,
    propertyStatus: string,
    ipAddress: string,
    marketingParams: Record<string, string>
  ): Promise<ConnectResponse>;
  verifyCode(code: string, spinwheelId: string, email: string, hubspotRecordId: string): Promise<ConnectResponse>;
  createContact(spinwheelId: string, email: string, hubspotRecordId: string): Promise<CreateContactResponse>;
  verifyManually(
    offerCode: string,
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    city: string,
    state: string,
    zip: string
  ): Promise<VerifyManuallyResponse>;
  submitApplication(
    email: string,
    ssnLast4: string,
    loanAmount: number,
    loanPurpose: string,
    employmentStatus: string,
    employmentFrequency: string,
    educationLevel: string,
    annualIncome: number,
    propertyStatus: string,
    ipAddress: string
  ): Promise<SubmitApplicationResponse>;
}

export class LeadsService implements ILeadsService {
  private readonly api: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    if (!baseUrl || !apiKey) {
      throw new Error('API configuration missing. Please check environment variables.');
    }

    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 60000, // 60 second timeout
      validateStatus: status => status >= 200 && status < 300 // Only resolve for 2xx status codes
    });

    // Add response interceptor for global error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.data?.status) {
          throw new ApiError(
            error.response.data.status.message,
            error.response.data.status
          );
        }
        throw error;
      }
    );
  }

  async connectBySms(
    phoneNumber: string, 
    email: string, 
    dateOfBirth: string,
    loanAmount: number,
    loanPurpose: string,
    employmentStatus: string,
    employmentFrequency: string,
    educationLevel: string,
    annualIncome: number,
    propertyStatus: string,
    ipAddress: string,
    marketingParams: Record<string, string>
  ): Promise<ConnectResponse> {
    try {
      const response = await this.api.post('/leads/connect', {
        email,
        phone: formatE164(phoneNumber),
        dateOfBirth,
        loanAmount,
        loanPurpose,
        employmentStatus,
        employmentPayFrequency: (employmentFrequency === '') ? 'biweekly' : employmentFrequency,
        educationLevel,
        annualIncome,
        propertyStatus,
        ipAddress,
        marketingParams
      });

      return connectResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error('Network error occurred while connecting user');
      }
      throw new Error('Failed to connect user');
    }
  }

  async verifyCode(
    code: string,
    spinwheelId: string,
    email: string,
    hubspotRecordId: string
  ): Promise<ConnectResponse> {
    try {
      const response = await this.api.post('/leads/verify', {
        code,
        spinwheelId,
        email,
        hubspotRecordId
      });

      return connectResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error('Network error occurred while verifying code');
      }
      throw new Error('Failed to verify code');
    }
  }

  async createContact(
    spinwheelId: string,
    email: string,
    hubspotRecordId: string
  ): Promise<CreateContactResponse> {
    try {
      const response = await this.api.post('/leads/create', {
        spinwheelId,
        email,
        hubspotRecordId
      });

      return createContactResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error('Network error occurred while creating contact');
      }
      throw new Error('Failed to create contact');
    }
  }

  async verifyManually(
    offerCode: string,
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    city: string,
    state: string,
    zip: string
  ): Promise<VerifyManuallyResponse> {
    try {
      // Restructure the flattened inputs into the required nested format
      const response = await this.api.post('/leads/manual', {
        offerCode,
        personalInfo: {
          firstName,
          lastName,
          email
        },
        addressInfo: {
          street,
          city,
          state,
          zip
        }
      });

      return verifyManuallyResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error('Network error occurred while verifying manually');
      }
      throw new Error('Failed to verify manually');
    }
  }

  async submitApplication(
    email: string,
    ssnLast4: string,
    loanAmount: number,
    loanPurpose: string,
    employmentStatus: string,
    employmentFrequency: string,
    educationLevel: string,
    annualIncome: number,
    propertyStatus: string,
    ipAddress: string
  ): Promise<SubmitApplicationResponse> {
    try {
      const response = await this.api.post('/leads/offers', {
        email,
        sensitiveLastFourSsn: parseInt(ssnLast4 || '0', 10),
        loanAmount,
        loanPurpose,
        employmentStatus,
        employmentPayFrequency: (employmentFrequency === '') ? 'biweekly' : employmentFrequency,
        educationLevel,
        annualIncome,
        propertyStatus,
        ipAddress
      });

      return submitApplicationResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error('Network error occurred while submitting application');
      }
      throw new Error('Failed to submit application');
    }
  }
}