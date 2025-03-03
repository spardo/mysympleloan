import React from 'react';
import { Activity } from 'lucide-react';
import type { HealthStatus, ServiceHealth } from './types';

type HealthMonitorProps = {
  servicesHealth: ServiceHealth[];
  onRefresh: () => void;
};

export default function HealthMonitor({ servicesHealth, onRefresh }: HealthMonitorProps) {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-3 text-sm">
      {servicesHealth.map(service => (
        <div key={service.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">{service.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
          </div>
          <div className="text-gray-600 text-xs flex items-center justify-between">
            <span>{service.message}</span>
            <span className="text-gray-500">
              {formatTimestamp(service.lastChecked)}
            </span>
          </div>
        </div>
      ))}
      <button
        onClick={onRefresh}
        className="mt-2 w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <Activity className="w-4 h-4" />
        Refresh Health Status
      </button>
    </div>
  );
}