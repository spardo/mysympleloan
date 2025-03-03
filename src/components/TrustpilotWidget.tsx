import React from 'react';
import { clientConfig } from '../config/clientConfig';

type TrustpilotWidgetProps = {
  size?: 'small' | 'medium' | 'large';
};

// Template ID and height mapping for different sizes
const TEMPLATE_CONFIG = {
  small: {
    templateId: '5419b6ffb0d04a076446a9af',
    height: '20px'
  },
  medium: {
    templateId: '5419b732fbfb950b10de65e5',
    height: '24px'
  },
  large: {
    templateId: '539ad0ffdec7e10e686debd7',
    height: '350px'
  }
} as const;

export default function TrustpilotWidget({ size = 'small' }: TrustpilotWidgetProps) {
  const config = TEMPLATE_CONFIG[size];

  return (
    <div 
      className="trustpilot-widget" 
      data-locale="en-US" 
      data-template-id={config.templateId} 
      data-businessunit-id={clientConfig.trustpilotBusinessUnitId}
      data-style-height={config.height}
      data-stars="4,5"
      data-style-width="100%" 
    >
      <a 
        href={`https://www.trustpilot.com/review/${clientConfig.trustpilotDomain}`}
        target="_blank" 
        rel="noopener"
      >
        Trustpilot
      </a>
    </div>
  );
}