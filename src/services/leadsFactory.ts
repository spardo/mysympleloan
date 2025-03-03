import { LeadsService, type ILeadsService } from './leads';
import { MockLeadsService } from './leads.mock';
import { clientConfig } from '../config/clientConfig';

export function createLeadsService(): ILeadsService {
  // Log configuration in development
  if (clientConfig.isDebugEnabled) {
    clientConfig.logConfig();
  }

  return clientConfig.shouldMockServices
    ? new MockLeadsService()
    : new LeadsService(clientConfig.apiBaseUrl, clientConfig.apiKey);
}