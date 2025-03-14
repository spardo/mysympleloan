import { z } from 'zod';

// Schema for GTM events
const gtmEventSchema = z.object({
  event: z.string(),
  error: z.record(z.any()).optional(),
  time: z.string().optional(),
  formStep: z.string().optional(),
  formData: z.record(z.any()).optional()
});

type GTMEvent = z.infer<typeof gtmEventSchema>;

class GTMManager {
  private static instance: GTMManager;
  private firedEvents: Set<string> = new Set();

  private constructor() {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
  }

  public static getInstance(): GTMManager {
    if (!GTMManager.instance) {
      GTMManager.instance = new GTMManager();
    }
    return GTMManager.instance;
  }

  private pushEvent(event: GTMEvent): void {
    try {
      const validatedEvent = gtmEventSchema.parse(event);
      window.dataLayer.push(validatedEvent);
    } catch (error) {
      console.error('Invalid GTM event:', error);
    }
  }

  public trackStepProgress(step: string, formData: Record<string, any> = {}): void {
    const eventName = `step:${step}`;
    
    // Only fire each step event once per session
    if (!this.firedEvents.has(eventName)) {
      this.pushEvent({
        event: eventName,
        formStep: step,
        formData,
        time: new Date().toISOString()
      });
      this.firedEvents.add(eventName);
    }
  }

  public trackFormSubmission(event: string, formData: Record<string, any> = {}): void {
    this.pushEvent({
      event,
      formData,
      time: new Date().toISOString()
    });
  }

  public trackFormError(event: string, error: string, formData: Record<string, any> = {}): void {
    this.pushEvent({
      event,
      error,
      formData,
      time: new Date().toISOString()
    });
  }

  // Reset tracking (useful for testing)
  public reset(): void {
    this.firedEvents.clear();
  }
}

// Export singleton instance
export const gtm = GTMManager.getInstance();