# 오메추 (오늘 메뉴 추천) 🍽️

GPS 위치 기반 주변 식당 추천, AI 메뉴 추천, 배달앱 연동 기능을 제공하는 Next.js 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📍 **GPS 위치 기반 주변 식당 검색** (3km 반경)
- 🎯 **랜덤 추천** - 3초 안에 골라주는 기능
- 🤖 **AI 메뉴 추천** - 기분에 따른 맞춤 추천 (무료)
- 🍕 **배달앱 연동** - 배달의민족, 요기요, 쿠팡이츠
- 🗺️ **지도 연동** - 네이버지도, 카카오맵
- 📱 **PWA 지원** - 모바일 앱처럼 설치 가능
- 🎨 **세련된 UI/UX** - 모던한 그라데이션 디자인

## 🚀 배포 방법

### 1. Vercel 배포 (추천)

#### 준비사항
1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 준비

#### 배포 단계
```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 빌드 테스트
npm run build

# 3. Vercel에 배포
vercel

# 4. 환경 변수 설정 (Vercel 대시보드에서)
```

#### 환경 변수 설정
Vercel 대시보드 → 프로젝트 설정 → Environment Variables에서 다음을 추가:

```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
NEXT_PUBLIC_AD_BANNER_LINK=https://example.com/ad
NEXT_PUBLIC_AD_BANNER_TEXT=특별한 맛집을 찾고 계신가요? 🍽️
```

### 2. Netlify 배포

#### 준비사항
1. [Netlify](https://netlify.com) 계정 생성
2. GitHub 저장소 준비

#### 배포 단계
```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 프로젝트 빌드
npm run build

# 3. Netlify에 배포
netlify deploy --prod --dir=out
```

### 3. GitHub Pages 배포

#### 준비사항
1. GitHub 저장소 준비
2. GitHub Actions 설정

#### 배포 단계
1. `.github/workflows/deploy.yml` 파일 생성
2. GitHub Actions에서 자동 배포 설정
3. 환경 변수는 GitHub Secrets에 추가

### 4. Docker 배포

```bash
# 1. Dockerfile 생성
# 2. 이미지 빌드
docker build -t omechu .

# 3. 컨테이너 실행
docker run -p 3000:3000 omechu
```

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행
```bash
# 1. 저장소 클론
git clone https://github.com/your-username/omechu.git
cd omechu

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp env.example .env.local
# .env.local 파일을 편집하여 API 키들을 설정

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 확인
# http://localhost:3000
```

## 🔑 API 키 설정

### 1. OpenAI API (유료)
- [OpenAI](https://platform.openai.com)에서 API 키 발급
- `.env.local`에 `OPENAI_API_KEY` 설정

### 2. Hugging Face API (무료)
- [Hugging Face](https://huggingface.co)에서 API 키 발급
- `.env.local`에 `HUGGINGFACE_API_KEY` 설정

### 3. 카카오 API (무료)
- [카카오 개발자](https://developers.kakao.com)에서 REST API 키 발급
- `.env.local`에 `KAKAO_REST_API_KEY`와 `NEXT_PUBLIC_KAKAO_REST_API_KEY` 설정

## 📱 PWA 기능

- 모바일에서 홈 화면에 추가 가능
- 오프라인 지원
- 앱과 같은 사용자 경험

## 🎨 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT, Hugging Face
- **Maps**: 카카오 로컬 API
- **PWA**: Service Worker, Web App Manifest

## 📁 프로젝트 구조

```
omechu/
├── components/          # React 컴포넌트
├── pages/              # Next.js 페이지
│   ├── api/           # API 라우트
│   └── index.tsx      # 메인 페이지
├── public/             # 정적 파일
├── styles/             # CSS 파일
├── types/              # TypeScript 타입 정의
├── next.config.js      # Next.js 설정
├── tailwind.config.js  # Tailwind CSS 설정
└── package.json        # 프로젝트 의존성
```

## 🚀 빌드 스크립트

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 정적 내보내기
npm run export

# Android 앱 빌드
npm run build:android

# iOS 앱 빌드
npm run build:ios
```

## 🔍 문제 해결

### 빌드 오류
```bash
# 캐시 클리어
rm -rf .next
npm run build
```

### 환경 변수 문제
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- API 키가 올바르게 설정되었는지 확인

### 배포 후 문제
- 환경 변수가 배포 플랫폼에 올바르게 설정되었는지 확인
- API 키의 도메인 제한 설정 확인

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**오메추**로 맛있는 식당을 쉽게 찾아보세요! 🍽️✨ 