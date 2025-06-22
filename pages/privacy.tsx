import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>개인정보처리방침 - 오메추</title>
        <meta name="description" content="오메추 앱의 개인정보처리방침입니다." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            개인정보처리방침
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              최종 업데이트: 2024년 12월 21일
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. 개인정보 수집 및 이용 목적
              </h2>
              <p className="text-gray-700 mb-4">
                오메추는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>위치 기반 주변 식당 검색 서비스 제공</li>
                <li>AI 기반 맞춤 메뉴 추천 서비스 제공</li>
                <li>앱 기능 개선 및 사용자 경험 향상</li>
                <li>고객 지원 및 문의 응답</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. 수집하는 개인정보 항목
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">필수 수집 항목:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>위치 정보 (GPS 좌표)</li>
                  <li>기기 정보 (기기 모델, OS 버전)</li>
                  <li>앱 사용 로그</li>
                </ul>
                
                <h3 className="font-medium text-gray-900 mb-2 mt-4">선택 수집 항목:</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>사용자 입력 기분 데이터 (AI 추천용)</li>
                  <li>수동 입력 위치 정보</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. 개인정보 보유 및 이용기간
              </h2>
              <p className="text-gray-700">
                수집된 개인정보는 서비스 제공 목적 달성 후 즉시 파기됩니다. 
                단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-gray-700 mb-4">
                오메추는 다음과 같은 경우에만 개인정보를 제3자에게 제공합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>사용자의 사전 동의가 있는 경우</li>
                <li>법령에 의해 요구되는 경우</li>
                <li>카카오 로컬 API를 통한 주변 식당 검색 (위치 정보만)</li>
                <li>AI 추천 서비스를 위한 외부 API 호출 (기분 데이터만)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. 개인정보 보호 조치
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>개인정보 암호화 저장 및 전송</li>
                <li>접근 권한 관리 및 제한</li>
                <li>정기적인 보안 점검 및 업데이트</li>
                <li>개인정보 처리 담당자 교육</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. 이용자의 권리
              </h2>
              <p className="text-gray-700 mb-4">
                이용자는 다음과 같은 권리를 가집니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>개인정보 수집 및 이용에 대한 동의 철회</li>
                <li>개인정보 열람, 정정, 삭제 요구</li>
                <li>개인정보 처리 중단 요구</li>
                <li>개인정보 이전 요구</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. 쿠키 및 추적 기술
              </h2>
              <p className="text-gray-700">
                오메추는 서비스 제공을 위해 필요한 최소한의 쿠키를 사용합니다. 
                브라우저 설정에서 쿠키 사용을 제한할 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. 개인정보처리방침 변경
              </h2>
              <p className="text-gray-700">
                이 개인정보처리방침은 법령 및 방침에 따라 변경될 수 있습니다. 
                변경사항은 앱 내 공지사항을 통해 고지합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. 문의 및 연락처
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  개인정보 처리에 관한 문의사항이 있으시면 아래로 연락해 주세요.
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-700">
                    <strong>개인정보보호책임자:</strong> 오메추 개발팀
                  </p>
                  <p className="text-gray-700">
                    <strong>이메일:</strong> privacy@omechu.app
                  </p>
                  <p className="text-gray-700">
                    <strong>주소:</strong> [회사 주소]
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
