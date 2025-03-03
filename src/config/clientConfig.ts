import { z } from 'zod';
import { getEnvironmentConfig, getCurrentEnvironment, Environment, type EnvironmentConfig } from './environment';

class ClientConfig {
  private static instance: ClientConfig;
  private config: EnvironmentConfig;
  private environment: typeof Environment[keyof typeof Environment];

  private constructor() {
    this.environment = getCurrentEnvironment();
    this.config = getEnvironmentConfig();
  }

  public static getInstance(): ClientConfig {
    if (!ClientConfig.instance) {
      ClientConfig.instance = new ClientConfig();
    }
    return ClientConfig.instance;
  }

  private getDomainType(): 'sym' | 'msl' | 'pre' {
    const hostname = window.location.hostname;
    if (hostname.endsWith('mysympleloan.com')) {
      return 'msl';
    } else if (hostname.endsWith('netlify.app')) {
      return 'pre';
    }
    return 'sym'; // Default to sym for symplelending.com or any other domain
  }

  // Environment checks
  get isDevelopment(): boolean {
    return this.environment === Environment.Development;
  }

  get isProduction(): boolean {
    return this.environment === Environment.Production;
  }

  get isTest(): boolean {
    return this.environment === Environment.Test;
  }

  // Feature flags
  get shouldMockServices(): boolean {
    return this.config.mockServices;
  }

  get isDebugEnabled(): boolean {
    return this.config.debug;
  }

  // Configuration getters
  get apiBaseUrl(): string {
    const domainType = this.getDomainType();
    return this.config[domainType].apiBaseUrl;
  }

  get apiKey(): string {
    return this.config.apiKey;
  }

  get hubspotUrl(): string | undefined {
    return this.config.hubspotUrl;
  }

  get hubspotPortalId(): string | undefined {
    return this.config.hubspotPortalId;
  }

  get domainType(): string {
    return this.getDomainType();
  }
  
  get trustpilotBusinessUnitId(): string {
    const domainType = this.getDomainType();
    return this.config[domainType].trustpilotBusinessUnitId;
  }

  get trustpilotDomain(): string {
    const domainType = this.getDomainType();
    return this.config[domainType].trustpilotDomain;
  }

  get gtmContainerId(): string {
    const domainType = this.getDomainType();
    return this.config[domainType].gtmContainerId;
  }

  get awsRum() {
    const domainType = this.getDomainType();
    const appId = this.config[domainType].rumApplicationId;
    return {
      applicationId: appId,
      identityPoolId: this.config.awsRum.identityPoolId,
      region: this.config.awsRum.region,
      enabled: this.config.awsRum.enabled
    };
  }

  // Debug methods
  logConfig(): void {
    if (this.isDebugEnabled) {
      console.log('Current Environment:', this.environment);
      console.log('Domain Type:', this.getDomainType());
      console.log('Configuration:', {
        ...this.config,
        apiKey: '****' // Hide sensitive data in logs
      });
    }
  }
}

// Export singleton instance
export const clientConfig = ClientConfig.getInstance();