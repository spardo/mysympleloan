import React from 'react';

type TrafficAnalysisProps = {
  trafficData: Record<string, string>;
  onCopy: (text: string) => void;
};

export default function TrafficAnalysis({ trafficData, onCopy }: TrafficAnalysisProps) {
  return (
    <div className="space-y-2 text-sm">
      {Object.entries(trafficData).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="font-medium text-gray-700">{key}</div>
          <div 
            className="font-mono text-gray-600 break-all cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
            onClick={() => onCopy(value)}
            title="Click to copy"
          >
            {value}
          </div>
        </div>
      ))}
      {Object.keys(trafficData).length === 0 && (
        <div className="text-gray-500 italic">No tracking parameters detected</div>
      )}
    </div>
  );
}