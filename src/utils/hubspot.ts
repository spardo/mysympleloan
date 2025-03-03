import { z } from 'zod';

// Type definitions
export type HubspotEventProperties = Record<string, string | number | boolean>;

export type HubspotIdentifyProperties = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  [key: string]: any;
};

// Schema for validation
const eventPropertiesSchema = z.record(z.union([
  z.string(),
  z.number(),
  z.boolean()
]));

const identifyPropertiesSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional()
}).catchall(z.any());

/**
 * HubSpot tracking utility class
 */
export class HubspotTracker {
  private static instance: HubspotTracker;
  private initialized: boolean = false;

  private constructor() {
    // Initialize HubSpot queue
    window._hsq = window._hsq || [];
    this.initialized = true;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): HubspotTracker {
    if (!HubspotTracker.instance) {
      HubspotTracker.instance = new HubspotTracker();
    }
    return HubspotTracker.instance;
  }

  /**
   * Identify a visitor
   */
  public identify(properties: HubspotIdentifyProperties): void {
    try {
      const validatedProps = identifyPropertiesSchema.parse(properties);
      window._hsq.push(['identify', validatedProps]);
    } catch (error) {
      console.error('Invalid identify properties:', error);
    }
  }

  /**
   * Set the current page path
   */
  public setPath(path: string): void {
    window._hsq.push(['setPath', path]);
  }

  /**
   * Track a page view
   */
  public trackPageView(): void {
    window._hsq.push(['trackPageView']);
  }

  /**
   * Get cross-domain linking parameters
   */
  public getCrossDomainLinkingParams(): URLSearchParams {
    const params = new URLSearchParams(window.location.search);
    const hubspotParams = Array.from(params.entries())
      .filter(([key]) => key.startsWith('__hs'))
      .reduce((acc, [key, value]) => {
        acc.append(key, value);
        return acc;
      }, new URLSearchParams());

    return hubspotParams;
  }

  /**
   * Reapply analytics event handlers
   */
  public reapplyEventHandlers(): void {
    window._hsq.push(['trackClick']);
  }

  /**
   * Track a custom behavioral event
   */
  public trackEvent(
    eventId: string,
    properties: HubspotEventProperties = {}
  ): void {
    try {
      const validatedProps = eventPropertiesSchema.parse(properties);
      window._hsq.push(['trackEvent', {
        id: eventId,
        value: validatedProps
      }]);
    } catch (error) {
      console.error('Invalid event properties:', error);
    }
  }

  /**
   * Set the content type for the current page
   */
  public setContentType(contentType: string): void {
    window._hsq.push(['setContentType', contentType]);
  }

  /**
   * Set a custom property for the current page
   */
  public setPageProperty(name: string, value: string): void {
    window._hsq.push(['setPageProperty', name, value]);
  }

  /**
   * Add a privacy consent status
   */
  public addPrivacyConsentStatus(
    granted: boolean,
    legalBasis: string = 'legitimate interest'
  ): void {
    window._hsq.push([
      'addPrivacyConsentListener',
      { granted, legalBasis }
    ]);
  }

  /**
   * Reset tracking data (useful for testing)
   */
  public reset(): void {
    window._hsq = [];
    this.initialized = false;
  }
}

// Export singleton instance
export const hubspot = HubspotTracker.getInstance();