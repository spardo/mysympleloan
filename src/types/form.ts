import { z } from 'zod';

export const loanPurposeEnum = z.enum([
  'debt_consolidation',
  'credit_card_refi',
  'emergency',
  'home_improvement',
  'large_purchases',
  'other'
]);

export const propertyStatusEnum = z.enum([
  'own_with_mortgage',
  'rent'
]);

export const employmentStatusEnum = z.enum([
  'employed',
  'employed_full_time',
  'employed_part_time',
  'military',
  'not_employed',
  'self_employed',
  'retired',
  'other'
]);

export const employmentFrequencyEnum = z.enum([
  'weekly',
  'biweekly',
  'twice_monthly',
  'monthly'
]);

export const educationLevelEnum = z.enum([
  'high_school',
  'associate',
  'bachelors',
  'masters',
  'doctorate',
  'other_grad_degree',
  'certificate',
  'did_not_graduate',
  'still_enrolled',
  'other'
]);

export const formSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  birthDate: z.string().min(10),
  smsConsent: z.boolean(),
  promoSmsConsent: z.boolean().optional(),
  smsCode: z.string().optional(),
  loanPurpose: loanPurposeEnum.optional(),
  loanAmount: z.number().min(500).max(50000).optional(),
  propertyStatus: propertyStatusEnum.optional(),
  employmentStatus: employmentStatusEnum.optional(),
  employmentFrequency: employmentFrequencyEnum.optional(),
  annualIncome: z.number().min(0).optional(),
  educationLevel: educationLevelEnum.optional(),
  ssnLast4: z.string().optional()
});

export type FormData = z.infer<typeof formSchema>;

export type ApiResponse = {
  success: boolean;
  message?: string;
  verificationId?: string;
};