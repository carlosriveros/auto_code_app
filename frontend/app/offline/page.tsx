'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gray-100 rounded-full">
            <WifiOff className="h-12 w-12 text-gray-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Some features may still work offline if you've visited them before!
          </p>
        </div>
      </div>
    </div>
  );
}
