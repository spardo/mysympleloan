import { z } from 'zod';

// Environment type definition
export const Environment = {
  Development: 'development',
  Production: 'production',
  Test: 'test'
} as const;

export type EnvironmentType = typeof Environment[keyof typeof Environment];

// Domain configuration type
export type DomainConfig = {
  trustpilotBusinessUnitId: string;
  trustpilotDomain: string;
  gtmContainerId: string;
  rumApplicationId: string;
  apiBaseUrl: string;
};

// Environment-specific configuration schema
const environmentConfigSchema = z.object({
  apiKey: z.string().min(1),
  hubspotUrl: z.string(),
  hubspotPortalId: z.string(),
  sym: z.object({
    apiBaseUrl: z.string().url(),
    trustpilotBusinessUnitId: z.string(),
    trustpilotDomain: z.string(),
    gtmContainerId: z.string(),
    rumApplicationId: z.string(),
  }),
  msl: z.object({
    apiBaseUrl: z.string().url(),
    trustpilotBusinessUnitId: z.string(),
    trustpilotDomain: z.string(),
    gtmContainerId: z.string(),
    rumApplicationId: z.string(),
  }),
  pre: z.object({
    apiBaseUrl: z.string().url(),
    trustpilotBusinessUnitId: z.string(),
    trustpilotDomain: z.string(),
    gtmContainerId: z.string(),
    rumApplicationId: z.string(),
  }),
  mockServices: z.boolean(),
  debug: z.boolean(),
  awsRum: z.object({
    identityPoolId: z.string(),
    region: z.string(),
    enabled: z.boolean()
  })
});

export type EnvironmentConfig = z.infer<typeof environmentConfigSchema>;

// Environment configurations
const configurations: Record<EnvironmentType, EnvironmentConfig> = {
  development: {
    apiKey: 'rzyjLyvzUf8ekEaqM6iKp7l96I2arRuN2e3KHtT6',
    hubspotUrl: 'https://46093292.hs-sites.com',
    hubspotPortalId: '46093292',
    sym: {
      apiBaseUrl: 'https://core.dev.sympleservices.io',
      trustpilotBusinessUnitId: '60746c04f2eabb000133f66d',
      gtmContainerId: 'GTM-M7KTRHW',
      trustpilotDomain: 'symplelending.com',
      rumApplicationId: 'df30c990-7e03-48fe-8d83-d668fa255d53',
    },
    msl: {
      apiBaseUrl: 'https://core.dev.sympleservices.io',
      trustpilotBusinessUnitId: '6254caf25ce7d4b7427851cc',
      gtmContainerId: 'GTM-NNMG7BP',
      trustpilotDomain: 'mysympleloan.com',
      rumApplicationId: '4e51f483-a743-4f68-9160-83cb2ff016ba',
    },
    pre: {
      apiBaseUrl: 'https://core.dev.sympleservices.io',
      trustpilotBusinessUnitId: '60746c04f2eabb000133f66d',
      gtmContainerId: 'GTM-M7KTRHW',
      trustpilotDomain: 'pre.symplelending.com',
      rumApplicationId: '44e2a40b-3638-472c-91bb-d731b9d0e6b9',
    },
    mockServices: true,
    debug: true,
    awsRum: {
      identityPoolId: 'us-east-1:04276d05-078b-445f-80f0-dec57fa6b37c',
      region: 'us-east-1',
      enabled: true
    }
  },
  production: {
    apiKey: 'dZO8DEFJyo7HrMEy00H1y5lyO0Bki50q7wmsNc7Q',
    hubspotUrl: 'https://symplelending.com',
    hubspotPortalId: '44977415',
    sym: {
      apiBaseUrl: 'https://core.sympleservices.io',
      trustpilotBusinessUnitId: '60746c04f2eabb000133f66d',
      gtmContainerId: 'GTM-M7KTRHW',
      trustpilotDomain: 'symplelending.com',
      rumApplicationId: 'df30c990-7e03-48fe-8d83-d668fa255d53',
    },
    msl: {
      apiBaseUrl: 'https://core.sympleservices.io',
      trustpilotBusinessUnitId: '6254caf25ce7d4b7427851cc',
      gtmContainerId: 'GTM-NNMG7BP',
      trustpilotDomain: 'mysympleloan.com',
      rumApplicationId: '4e51f483-a743-4f68-9160-83cb2ff016ba',
    },
    pre: {
      apiBaseUrl: 'https://core.pre.sympleservices.io',
      trustpilotBusinessUnitId: '60746c04f2eabb000133f66d',
      gtmContainerId: 'GTM-M7KTRHW',
      trustpilotDomain: 'pre.symplelending.com',
      rumApplicationId: '44e2a40b-3638-472c-91bb-d731b9d0e6b9',
    },
    mockServices: false,
    debug: false,
    awsRum: {
      identityPoolId: 'us-east-1:04276d05-078b-445f-80f0-dec57fa6b37c',
      region: 'us-east-1',
      enabled: true
    }
  },
  test: {
    apiBaseUrl: 'http://localhost:3000',
    apiKey: 'test-api-key',
    hubspotUrl: 'https://symplelending.com',
    hubspotPortalId: '44977415',
    sym: {
      trustpilotBusinessUnitId: 'test-unit-id-sym',
      gtmContainerId: 'GTM-TEST-SYM',
      trustpilotDomain: 'symplelending.com',
      rumApplicationId: 'test-application-id',
    },
    msl: {
      trustpilotBusinessUnitId: 'test-unit-id-msl',
      gtmContainerId: 'GTM-TEST-MSL',
      trustpilotDomain: 'mysympleloan.com',
      rumApplicationId: 'test-application-id',
    },
    net: {
      trustpilotBusinessUnitId: 'test-unit-id-msl',
      gtmContainerId: 'GTM-TEST-MSL',
      trustpilotDomain: 'preprod.symplelending.com',
      rumApplicationId: 'test-application-id',
    },
    mockServices: true,
    debug: true,
    awsRum: {
      applicationId: 'test-application-id',
      identityPoolId: 'test-identity-pool-id',
      region: 'us-east-1',
      enabled: false
    }
  }
};

// Get current environment
export function getCurrentEnvironment(): EnvironmentType {
  const mode = import.meta.env.MODE;
  return mode === 'production' ? Environment.Production : Environment.Development;
}

// Get environment configuration
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = getCurrentEnvironment();
  const config = configurations[environment];

  // Validate configuration
  const result = environmentConfigSchema.safeParse(config);

  if (!result.success) {
    console.error('Environment configuration validation failed:', result.error.format());
    throw new Error(`Invalid environment configuration for ${environment}`);
  }

  return result.data;
}