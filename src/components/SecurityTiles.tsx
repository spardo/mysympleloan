import React from 'react';

export default function SecurityTiles() {
 return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="font-semibold mb-1">256-bit SSL</div>
        <div>Secure & Encrypted</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="font-semibold mb-1">Privacy First</div>
        <div>Your Data is Protected</div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="font-semibold mb-1">Fast & Easy</div>
        <div>2-Minute Application</div>
      </div>
    </div>
  );
}