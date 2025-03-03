import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hubspot } from '../utils/hubspot';

/**
 * Hook to handle HubSpot tracking in React components
 */
export function useHubspot() {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    // Set the current path
    hubspot.setPath(location.pathname + location.search);
    
    // Track the page view
    hubspot.trackPageView();
    
    // Reapply event handlers for the new page
    hubspot.reapplyEventHandlers();
  }, [location]);

  return hubspot;
}