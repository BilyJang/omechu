# 📱 스토어 배포 가이드

오메추 앱을 구글 플레이 스토어와 앱스토어에 무료로 배포하는 방법을 안내합니다.

## 🚀 배포 방법

### 방법 1: PWA Builder (추천 - 가장 쉬움)

#### 1단계: PWA Builder 접속
- [PWA Builder](https://www.pwabuilder.com/) 접속
- 앱 URL 입력: `https://your-domain.com` (Vercel 배포 후)
- "Build My PWA" 클릭

#### 2단계: Android APK 생성
- Android 탭에서 "Generate Package" 클릭
- APK 파일 다운로드

#### 3단계: iOS IPA 생성
- iOS 탭에서 "Generate Package" 클릭
- IPA 파일 다운로드

### 방법 2: Bubblewrap (Android 전용)

#### 1단계: 환경 설정
```bash
# Node.js 16+ 설치 필요
npm install -g @bubblewrap/cli

# Android Studio 설치
# Java 11 설치
```

#### 2단계: 프로젝트 초기화
```bash
bubblewrap init --manifest https://your-domain.com/manifest.json
```

#### 3단계: APK 빌드
```bash
bubblewrap build
```

### 방법 3: Capacitor (iOS/Android)

#### 1단계: Capacitor 설치
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

#### 2단계: 프로젝트 초기화
```bash
npx cap init "오메추" "com.omechu.app"
npx cap add android
npx cap add ios
```

#### 3단계: 빌드
```bash
npm run build
npx cap sync
npx cap build android
npx cap build ios
```

## 📋 구글 플레이 스토어 배포

### 1단계: 개발자 계정 생성
- [Google Play Console](https://play.google.com/console) 가입
- $25 일회성 등록비 지불

### 2단계: 앱 정보 입력
```
앱 이름: 오메추 - 오늘 메뉴 추천
패키지명: com.omechu.app
카테고리: 음식 및 음료
콘텐츠 등급: 전체이용가
```

### 3단계: 스토어 등록 정보
```
앱 설명:
주변 맛집을 찾고 AI에게 메뉴를 추천받는 무료 앱입니다.

주요 기능:
• GPS 기반 주변 식당 검색
• 랜덤 메뉴 추천
• AI 기반 맞춤 메뉴 추천
• 배달앱 연동
• PWA 지원으로 빠른 로딩

키워드: 맛집, 메뉴추천, 음식, AI, 배달
```

### 4단계: 스크린샷 및 아이콘
- 앱 아이콘: 512x512 PNG
- 스크린샷: 다양한 화면 크기별
- 피처드 그래픽: 1024x500 PNG

### 5단계: APK 업로드
- Production 트랙 선택
- APK 파일 업로드
- 릴리즈 노트 작성

## 🍎 앱스토어 배포

### 1단계: Apple Developer 계정
- [Apple Developer](https://developer.apple.com/) 가입
- $99/년 구독료

### 2단계: App Store Connect 설정
```
앱 이름: 오메추 - 오늘 메뉴 추천
번들 ID: com.omechu.app
카테고리: Food & Drink
콘텐츠 등급: 4+
```

### 3단계: 앱 정보
```
설명:
주변 맛집을 찾고 AI에게 메뉴를 추천받는 무료 앱입니다.

주요 기능:
• GPS 기반 주변 식당 검색
• 랜덤 메뉴 추천
• AI 기반 맞춤 메뉴 추천
• 배달앱 연동
• PWA 지원으로 빠른 로딩

키워드: 맛집,메뉴추천,음식,AI,배달
```

### 4단계: 스크린샷 및 메타데이터
- 앱 아이콘: 1024x1024 PNG
- 스크린샷: iPhone/iPad 다양한 크기
- 앱 미리보기 비디오 (선택사항)

### 5단계: IPA 업로드
- Xcode 또는 Application Loader 사용
- App Store Connect에 업로드
- 심사 제출

## 🔧 빌드 스크립트

### 로컬 빌드
```bash
# 정적 파일 생성
npm run export

# Android APK 빌드
npm run build:android

# iOS IPA 빌드
npm run build:ios
```

### CI/CD 파이프라인 (GitHub Actions)
```yaml
name: Build for Store
on:
  push:
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build:android
      - uses: actions/upload-artifact@v2
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/
```

## 📊 배포 체크리스트

### 필수 항목
- [ ] 앱 아이콘 (512x512, 1024x1024)
- [ ] 스크린샷 (다양한 화면 크기)
- [ ] 앱 설명 및 키워드
- [ ] 개인정보처리방침 URL
- [ ] 지원 이메일
- [ ] 앱 버전 및 빌드 번호

### 권장 항목
- [ ] 앱 미리보기 비디오
- [ ] 피처드 그래픽
- [ ] 다국어 지원
- [ ] 접근성 설정
- [ ] 앱 내 구매 설정 (필요시)

## 💰 비용 안내

### 구글 플레이 스토어
- 개발자 등록비: $25 (일회성)
- 앱 등록: 무료
- 수익 공유: 15% (첫 $1M), 30% (이후)

### 앱스토어
- 개발자 등록비: $99/년
- 앱 등록: 무료
- 수익 공유: 30% (일반), 15% (Small Business Program)

## 🚨 주의사항

1. **개인정보처리방침 필수**: GPS 위치 정보 사용 시 반드시 필요
2. **앱 심사 기간**: 구글 1-3일, 애플 1-7일
3. **버전 관리**: 스토어 업데이트 시 버전 번호 증가 필수
4. **테스트**: 실제 기기에서 충분한 테스트 필요
5. **법적 준수**: 각 스토어의 정책 준수 필수

## 📞 지원

배포 과정에서 문제가 발생하면:
- [GitHub Issues](https://github.com/your-repo/issues)
- 이메일: support@omechu.app

---

**성공적인 스토어 배포를 응원합니다! 🎉** 