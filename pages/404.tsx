import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>페이지를 찾을 수 없습니다 - 오메추</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            페이지를 찾을 수 없습니다 😢
          </h2>
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
          <Link 
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </>
  );
} 
