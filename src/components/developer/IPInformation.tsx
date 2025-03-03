import React from 'react';
import type { IPInfo } from './types';

type IPInformationProps = {
  ipInfo: IPInfo | null;
  ipError: string | null;
  onCopy: (text: string) => void;
};

export default function IPInformation({ ipInfo, ipError, onCopy }: IPInformationProps) {
  return (
    <div className="space-y-2 text-sm">
      {ipError ? (
        <div className="text-red-600">{ipError}</div>
      ) : ipInfo ? (
        <div className="space-y-1">
          <div className="font-medium text-gray-700">IP Address</div>
          <div 
            className="font-mono text-gray-600 break-all cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
            onClick={() => onCopy(ipInfo.ip)}
            title="Click to copy"
          >
            {ipInfo.ip}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Loading IP information...</div>
      )}
    </div>
  );
}