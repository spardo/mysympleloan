import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, RotateCcw, Activity, Globe, Network, Database, FileText, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageController } from '../controllers/StorageController';
import Section from './developer/Section';
import HealthMonitor from './developer/HealthMonitor';
import IPInformation from './developer/IPInformation';
import TrafficAnalysis from './developer/TrafficAnalysis';
import EnvironmentVariables from './developer/EnvironmentVariables';
import FormDataViewer from './developer/FormDataViewer';
import FormNavigation from './developer/FormNavigation';
import type { ServiceHealth, IPInfo, Section as SectionType } from './developer/types';
import { clientConfig } from '../config/clientConfig';

const ENV_VARIABLES = {
  'API_BASE_URL': clientConfig.apiBaseUrl,
  'API_KEY': clientConfig.apiKey,
  'HUBSPOT_PORTAL_ID': clientConfig.hubspotPortalId || '',
  'TRUSTPILOT_BUSINESS_UNIT_ID': clientConfig.trustpilotBusinessUnitId,
  'GTM_CONTAINER_ID': clientConfig.gtmContainerId,
  'AWS_RUM_APPLICATION_ID': clientConfig.awsRum.applicationId,
  'AWS_RUM_IDENTITY_POOL_ID': clientConfig.awsRum.identityPoolId,
  'AWS_RUM_REGION': clientConfig.awsRum.region,
  'AWS_RUM_ENABLED': clientConfig.awsRum.enabled.toString(),
  'ENVIRONMENT': clientConfig.isDevelopment ? 'development' : clientConfig.isProduction ? 'production' : 'test',
  'MOCK_SERVICES': clientConfig.shouldMockServices.toString(),
  'DEBUG_ENABLED': clientConfig.isDebugEnabled.toString()
};

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'msclkid', 'dclid', 'ttclid',
  'ref', 'source', 'affiliate', 'partner', 'campaign', 'medium', 'channel'
];

type DeveloperToolsProps = {
  formData: Record<string, any>;
};

export default function DeveloperTools({ formData }: DeveloperToolsProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [sections, setSections] = useState<Record<SectionType, boolean>>({
    health: true,
    env: true,
    formData: true,
    traffic: true,
    ipInfo: true,
    navigation: true
  });
  const [showRawValues, setShowRawValues] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [trafficData, setTrafficData] = useState<Record<string, string>>({});
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [ipError, setIpError] = useState<string | null>(null);
  const [servicesHealth, setServicesHealth] = useState<ServiceHealth[]>([]);

  useEffect(() => {
    initializeDevTools();
    checkServicesHealth();
    collectTrafficData();
    fetchIPInfo();

    const healthCheckInterval = setInterval(checkServicesHealth, 30000);
    return () => clearInterval(healthCheckInterval);
  }, []);

  const initializeDevTools = () => {
    const isDev = clientConfig.isDevelopment;
    const params = new URLSearchParams(window.location.search);
    setShowDevTools(isDev || params.get('mode') === 'developer');
  };

  const collectTrafficData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {};

    if (document.referrer) {
      data['referrer'] = document.referrer;
    }

    TRACKING_PARAMS.forEach(param => {
      const value = urlParams.get(param);
      if (value) data[param] = value;
    });

    data['timestamp'] = new Date().toISOString();
    data['userAgent'] = navigator.userAgent;
    data['landingPage'] = window.location.pathname + window.location.search;

    setTrafficData(data);
  };

  const fetchIPInfo = async () => {
    try {
      const response = await fetch('https://api64.ipify.org/?format=json');
      if (!response.ok) throw new Error('Failed to fetch IP information');
      const data = await response.json();
      setIpInfo(data);
      storageController.setUserIp(data.ip);
    } catch (error) {
      setIpError(error instanceof Error ? error.message : 'Failed to fetch IP information');
    }
  };

  const checkServicesHealth = async () => {
    const health: ServiceHealth[] = [];
    const now = new Date();

    const services = [
      { 
        name: 'AWS RUM', 
        check: () => {
          const awsRum = (window as any).AwsRum;
          return awsRum && typeof awsRum.recordError === 'function';
        }
      },
      { 
        name: 'Google Tag Manager', 
        check: () => !!(window as any).google_tag_manager 
      },
      { 
        name: 'HubSpot', 
        check: () => !!(window as any)._hsq 
      },
      { 
        name: 'Trustpilot', 
        check: () => !!(window as any).Trustpilot 
      }
    ];

    services.forEach(({ name, check }) => {
      try {
        const isHealthy = check();
        health.push({
          name,
          status: isHealthy ? 'healthy' : 'error',
          message: isHealthy ? 'Service is operational' : 'Service not initialized',
          lastChecked: now
        });
      } catch (error) {
        health.push({
          name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to check status',
          lastChecked: now
        });
      }
    });

    setServicesHealth(health);
  };

  const toggleSection = (section: SectionType) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatValue = (key: string, value: any): string => {
    if (value === undefined || value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (key.toLowerCase().includes('api_key') || key.toLowerCase().includes('identity_pool_id')) {
      return showRawValues ? value : `****-****-****-${value.slice(-4)}`;
    }
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  const handleReset = () => {
    if (showResetConfirm) {
      storageController.clearAll();
      const url = new URL(window.location.href);
      url.searchParams.set('clear', '1');
      window.location.href = url.toString();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFormNavigation = (route: string) => {
    if (route) {
      navigate(`/${route}`);
    }
  };

  if (!showDevTools) return null;

  return (
    <div 
      className="fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-50"
      style={{ width: '320px', transform: isVisible ? 'translateX(0)' : 'translateX(320px)' }}
    >
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute left-0 top-1/2 -translate-x-full bg-white border border-gray-200 p-2 rounded-l-lg shadow-md"
        aria-label={isVisible ? 'Hide developer tools' : 'Show developer tools'}
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Developer Tools</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRawValues(!showRawValues)}
                className="text-gray-600 hover:text-gray-900"
                title={showRawValues ? 'Mask sensitive values' : 'Show raw values'}
              >
                {showRawValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                  showResetConfirm
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Reset application"
              >
                <RotateCcw className="w-4 h-4" />
                {showResetConfirm ? 'Confirm Reset' : 'Reset'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Section
            title="Form Navigation"
            isOpen={sections.navigation}
            onToggle={() => toggleSection('navigation')}
            icon={Navigation}
          >
            <FormNavigation onNavigate={handleFormNavigation} />
          </Section>

          <Section
            title="Health Status"
            isOpen={sections.health}
            onToggle={() => toggleSection('health')}
            icon={Activity}
          >
            <HealthMonitor
              servicesHealth={servicesHealth}
              onRefresh={checkServicesHealth}
            />
          </Section>

          <Section
            title="IP Information"
            isOpen={sections.ipInfo}
            onToggle={() => toggleSection('ipInfo')}
            icon={Globe}
          >
            <IPInformation
              ipInfo={ipInfo}
              ipError={ipError}
              onCopy={copyToClipboard}
            />
          </Section>

          <Section
            title="Traffic Analysis"
            isOpen={sections.traffic}
            onToggle={() => toggleSection('traffic')}
            icon={Network}
          >
            <TrafficAnalysis
              trafficData={trafficData}
              onCopy={copyToClipboard}
            />
          </Section>

          <Section
            title="Environment Variables"
            isOpen={sections.env}
            onToggle={() => toggleSection('env')}
            icon={Database}
          >
            <EnvironmentVariables
              variables={ENV_VARIABLES}
              showRawValues={showRawValues}
              formatValue={formatValue}
            />
          </Section>

          <Section
            title="Form Data"
            isOpen={sections.formData}
            onToggle={() => toggleSection('formData')}
            icon={FileText}
          >
            <FormDataViewer
              formData={formData}
              formatValue={formatValue}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}