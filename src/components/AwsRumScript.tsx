import React, { useEffect } from 'react';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { clientConfig } from '../config/clientConfig';

declare global {
  interface Window {
    AwsRum?: AwsRum;
  }
}

export default function AwsRumScript() {
  useEffect(() => {
    try {
      // Only initialize if not already initialized and enabled in config
      if (!window.AwsRum && clientConfig.awsRum.enabled) {
        const config: AwsRumConfig = {
          sessionSampleRate: 1,
          identityPoolId: clientConfig.awsRum.identityPoolId,
          endpoint: `https://dataplane.rum.${clientConfig.awsRum.region}.amazonaws.com`,
          telemetries: ["performance", "errors", "http"],
          allowCookies: true,
          enableXRay: true
        };

        const APPLICATION_ID = clientConfig.awsRum.applicationId;
        const APPLICATION_VERSION = '1.0.0';
        const APPLICATION_REGION = clientConfig.awsRum.region;

        // Only initialize in production environment
        const awsRum: AwsRum = new AwsRum(
          APPLICATION_ID,
          APPLICATION_VERSION,
          APPLICATION_REGION,
          config
        );

        // Store the instance globally for health checks
        window.AwsRum = awsRum;
      }
    } catch (error) {
      // Ignore errors thrown during CloudWatch RUM web client initialization
      console.debug('Failed to initialize AWS RUM:', error);
    }
  }, []);

  return null;
}