'use client';

import { useEffect, useState } from 'react';
import { X, Download, Share } from 'lucide-react';

export function PWAInstall() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);

          // Check for updates
          registration.update();
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    if (isInstalled) {
      console.log('✅ App is already installed');
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      // Show iOS install instructions after a delay
      setTimeout(() => {
        setShowIOSPrompt(true);
      }, 3000);
    }

    // Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install button after a delay
      setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Track if app was installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA was installed');
      setShowAndroidPrompt(false);
      setShowIOSPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  const handleDismiss = (type: 'ios' | 'android') => {
    if (type === 'ios') {
      setShowIOSPrompt(false);
    } else {
      setShowAndroidPrompt(false);
    }
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (showIOSPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 animate-slide-up">
        <button
          onClick={() => handleDismiss('ios')}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Download className="h-6 w-6 text-blue-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Install AppBuilder
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Install this app on your iPhone: tap <Share className="inline h-4 w-4" /> and then "Add to Home Screen"
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Share className="h-3 w-3" />
                <span>Share</span>
              </div>
              <span>→</span>
              <span>Add to Home Screen</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAndroidPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 animate-slide-up">
        <button
          onClick={() => handleDismiss('android')}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Download className="h-6 w-6 text-blue-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Install AppBuilder
            </h3>
            <p className="text-sm text-gray-600">
              Install this app for a better experience and offline access
            </p>
          </div>

          <button
            onClick={handleInstallAndroid}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Install
          </button>
        </div>
      </div>
    );
  }

  return null;
}
