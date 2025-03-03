import { z } from 'zod';

// API Response Schemas
export const apiStatusSchema = z.object({
  code: z.number(),
  message: z.string()
});

export const connectResponseSchema = z.object({
  status: apiStatusSchema,
  spinwheelId: z.string().optional(),
  hubspotRecordId: z.string().optional()
});

export const createContactResponseSchema = z.object({
  spinwheelStatus: z.string(),
  firstName: z.string(),
  state: z.string(),
  status: apiStatusSchema
});

export const verifyManuallyResponseSchema = z.object({
  prospectStatus: z.enum(['QUALIFIED', 'UNQUALIFIED']),
  status: apiStatusSchema
});

export const submitApplicationResponseSchema = z.object({
  status: apiStatusSchema,
  offerId: z.string()
});

export type ApiStatus = z.infer<typeof apiStatusSchema>;
export type ConnectResponse = z.infer<typeof connectResponseSchema>;
export type CreateContactResponse = z.infer<typeof createContactResponseSchema>;
export type VerifyManuallyResponse = z.infer<typeof verifyManuallyResponseSchema>;
export type SubmitApplicationResponse = z.infer<typeof submitApplicationResponseSchema>;

// API Error
export class ApiError extends Error {
  constructor(
    message: string,
    public status: ApiStatus
  ) {
    super(message);
    this.name = 'ApiError';
  }
}