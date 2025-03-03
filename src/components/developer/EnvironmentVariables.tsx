import React from 'react';

type EnvironmentVariablesProps = {
  variables: Record<string, string>;
  showRawValues: boolean;
  formatValue: (key: string, value: any) => string;
};

export default function EnvironmentVariables({ 
  variables, 
  showRawValues, 
  formatValue 
}: EnvironmentVariablesProps) {
  return (
    <div className="space-y-2 text-sm">
      {Object.entries(variables).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="font-medium text-gray-700">{key}</div>
          <div className="font-mono text-gray-600 break-all">
            {formatValue(key, value)}
          </div>
        </div>
      ))}
    </div>
  );
}