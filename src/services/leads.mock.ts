import { 
  type ConnectResponse, 
  type CreateContactResponse, 
  type VerifyManuallyResponse,
  type SubmitApplicationResponse,
  type ApiStatus 
} from '../types/api';
import { type FormData } from '../types/form';
import { type ILeadsService } from './leads';

export class MockLeadsService implements ILeadsService {
  private mockDelay = 800;
  private mockSpinwheelId = 'mock-spinwheel-123';
  private mockHubspotRecordId = '101352502280';

  private async delay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
  }

  private createSuccessResponse(message: string = 'Success'): ConnectResponse {
    const status: ApiStatus = {
      code: 200,
      message
    };
    return {
      status,
      userId: this.mockSpinwheelId,
      spinwheelId: this.mockSpinwheelId,
      hubspotRecordId: this.mockHubspotRecordId
    };
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
    ipAddress: string
  ): Promise<ConnectResponse> {
    await this.delay();

    // Validate required fields
    if (!phoneNumber || !email || !dateOfBirth) {
      throw new Error('Missing required fields');
    }

    return this.createSuccessResponse('SMS code sent successfully');
  }

  async verifyCode(
    code: string,
    spinwheelId: string,
    email: string,
    hubspotRecordId: string
  ): Promise<ConnectResponse> {
    await this.delay();

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      const status: ApiStatus = {
        code: 400,
        message: 'Invalid verification code'
      };
      throw new Error(status.message);
    }

    // Validate required fields
    if (!spinwheelId || !email || !hubspotRecordId) {
      const status: ApiStatus = {
        code: 400,
        message: 'Missing required fields'
      };
      throw new Error(status.message);
    }

    return this.createSuccessResponse('Code verified successfully');
  }

  async createContact(
    spinwheelId: string,
    email: string,
    hubspotRecordId: string
  ): Promise<CreateContactResponse> {
    await this.delay();

    // Validate required fields
    if (!spinwheelId || !email || !hubspotRecordId) {
      const status: ApiStatus = {
        code: 400,
        message: 'Missing required fields'
      };
      throw new Error(status.message);
    }

    return {
      spinwheelStatus: 'QUALIFIED',
      firstName: 'CHRISTY',
      state: 'accepted',
      status: {
        code: 202,
        message: 'Lead accepted'
      }
    };
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
    await this.delay();

    // Validate required fields
    if (!firstName || !lastName || !email) {
      const status: ApiStatus = {
        code: 400,
        message: 'Missing required personal information'
      };
      throw new Error(status.message);
    }

    if (!street || !city || !state || !zip) {
      const status: ApiStatus = {
        code: 400,
        message: 'Missing required address information'
      };
      throw new Error(status.message);
    }

    // Simulate a "not found" response for a specific test case
    if (offerCode === 'notfound') {
      return {
        prospectStatus: 'UNQUALIFIED',
        status: {
          code: 404,
          message: 'USER NOT FOUND'
        }
      };
    }

    // Return success response
    return {
      prospectStatus: 'QUALIFIED',
      status: {
        code: 200,
        message: 'Found prospect'
      }
    };
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
    await this.delay();

    // Validate required fields
    if (!email || !ssnLast4 || !loanAmount || !loanPurpose || !ipAddress) {
      const status: ApiStatus = {
        code: 400,
        message: 'Missing required fields'
      };
      throw new Error(status.message);
    }

    return {
      status: {
        code: 200,
        message: 'Success'
      },
      offerId: '1bd9e444-4ff1-4354-accb-0a30b1929217'
    };
  }
}