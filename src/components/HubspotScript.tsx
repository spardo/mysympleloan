import React, { useEffect } from 'react';
import { clientConfig } from '../config/clientConfig';
import { hubspot } from '../utils/hubspot';

export default function HubspotScript() {
  useEffect(() => {
    const portalId = clientConfig.hubspotPortalId;
    
    if (!portalId) {
      console.warn('HubSpot Portal ID not configured');
      return;
    }

    // Add HubSpot script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    script.async = true;
    script.defer = true;
    script.src = `//js.hs-scripts.com/${portalId}.js`;
    
    // Set up onload handler to initialize content type after script loads
    script.onload = () => {
      // Set the content type
      hubspot.setContentType('landing-page');
      
      // Set any default page properties
      hubspot.setPageProperty('source', 'loan-application');
    };
    
    document.body.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('hs-script-loader');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
  
  return null;
}