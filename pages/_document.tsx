import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* PWA 매니페스트 */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA 메타 태그 */}
        <meta name="application-name" content="오메추 - 오늘 메뉴 추천" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="오메추" />
        <meta name="description" content="주변 맛집을 찾고 AI에게 메뉴를 추천받는 앱" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#f97316" />

        {/* 아이콘 */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#f97316" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* iOS 스플래시 스크린 */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://omechu.vercel.app" />
        <meta name="twitter:title" content="오메추 - 오늘 메뉴 추천" />
        <meta name="twitter:description" content="주변 맛집을 찾고 AI에게 메뉴를 추천받는 앱" />
        <meta name="twitter:image" content="https://omechu.vercel.app/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@omechu" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="오메추 - 오늘 메뉴 추천" />
        <meta property="og:description" content="주변 맛집을 찾고 AI에게 메뉴를 추천받는 앱" />
        <meta property="og:site_name" content="오메추" />
        <meta property="og:url" content="https://omechu.vercel.app" />
        <meta property="og:image" content="https://omechu.vercel.app/icons/icon-192x192.png" />

        {/* 카카오 지도 API - 클라이언트 사이드에서 동적으로 로드 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.loadKakaoMap = function() {
                if (typeof window !== 'undefined' && !window.kakao) {
                  const script = document.createElement('script');
                  script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=' + (window.NEXT_PUBLIC_KAKAO_REST_API_KEY || '') + '&libraries=services';
                  script.async = true;
                  document.head.appendChild(script);
                }
              };
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 
