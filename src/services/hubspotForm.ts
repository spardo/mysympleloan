import axios from 'axios';
import { z } from 'zod';
import { clientConfig } from '../config/clientConfig';
import { formatE164 } from '../utils/validation';

// Response schema for form submission
const hubspotFormResponseSchema = z.object({
  inlineMessage: z.string().optional(),
  redirectUri: z.string().optional(),
  status: z.enum(['success', 'error']),
  message: z.string().optional()
});

type HubspotFormResponse = z.infer<typeof hubspotFormResponseSchema>;

export class HubspotFormService {
  private readonly portalId: string;
  private readonly baseUrl: string;

  constructor() {
    this.portalId = clientConfig.hubspotPortalId || '';
    this.baseUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${this.portalId}`;
  }

  private async submitForm(formId: string, fields: Record<string, any>, context?: Record<string, any>): Promise<HubspotFormResponse> {
    try {
      if (!this.portalId) {
        throw new Error('HubSpot Portal ID not configured');
      }

      const payload = {
        fields: Object.entries(fields).map(([name, value]) => ({
          name,
          value
        })),
        context: {
          pageUri: window.location.href,
          pageName: document.title,
          ...context
        }
      };

      const response = await axios.post(`${this.baseUrl}/${formId}`, payload);
      return hubspotFormResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to submit form');
      }
      throw error;
    }
  }

  // Submit email and marketing parameters
  async submitEmailForm(email: string, marketingParams: Record<string, any>): Promise<HubspotFormResponse> {
    return this.submitForm('283760521', {
      email,
      ...marketingParams
    });
  }

  // Submit birth date information
  async submitBirthDateForm(email: string, birthDate: string): Promise<HubspotFormResponse> {
    return this.submitForm('283760522', {
      email,
      date_of_birth: birthDate,
      date_of_birth__c: birthDate,
      sensitive_date_of_birth: birthDate
    });
  }

  // Submit phone and consent information
  async submitPhoneForm(
    email: string, 
    phone: string, 
    smsConsent: boolean,
    promoSmsConsent: boolean
  ): Promise<HubspotFormResponse> {
    return this.submitForm('283760523', {
      email,
      phone: formatE164(phone),
      'LEGAL_CONSENT.subscription_type_283760521': smsConsent,
      'LEGAL_CONSENT.subscription_type_283760522': promoSmsConsent,
      mobilephone: formatE164(phone),
      hs_legal_basis: 'Legitimate interest'
    });
  }

  // Submit scheduled call information
  async submitScheduledCall(
    email: string,
    firstName: string,
    phone: string,
    scheduledTime: Date,
    timezone: string
  ): Promise<HubspotFormResponse> {
    return this.submitForm('283760524', {
      email,
      firstname: firstName,
      phone: formatE164(phone),
      scheduled_time: scheduledTime.toISOString(),
      timezone,
      call_status: 'Scheduled'
    });
  }
}

// Export singleton instance
export const hubspotForm = new HubspotFormService();