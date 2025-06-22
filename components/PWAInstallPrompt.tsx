import React, { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW 등록 성공:', registration);
          })
          .catch((registrationError) => {
            console.log('SW 등록 실패:', registrationError);
          });
      });
    }

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('사용자가 앱 설치를 수락했습니다');
    } else {
      console.log('사용자가 앱 설치를 거부했습니다');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">오메추 앱 설치</h3>
          <p className="text-xs text-gray-600 mt-1">
            홈 화면에 추가하여 더 빠르게 접근하세요
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleInstallClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium"
          >
            설치
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
} 
