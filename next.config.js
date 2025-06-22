/** @type {import('next').NextConfig} */
const nextConfig = {
  // 배포 최적화 설정
  output: 'standalone',
  
  // PWA 설정
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // 이미지 최적화
  images: {
    domains: ['place.map.kakao.com'],
    unoptimized: true, // 정적 배포를 위해 비활성화
  },
  
  // 정적 내보내기 설정
  trailingSlash: true,
}

module.exports = nextConfig 