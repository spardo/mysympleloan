export type HealthStatus = 'healthy' | 'warning' | 'error' | 'unknown';

export type ServiceHealth = {
  name: string;
  status: HealthStatus;
  message: string;
  lastChecked: Date;
};

export type IPInfo = {
  ip: string;
};

export type Section = 'health' | 'env' | 'formData' | 'traffic' | 'ipInfo' | 'navigation';