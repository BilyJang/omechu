import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>서버 오류 - 오메추</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            서버 오류가 발생했습니다 😢
          </h2>
          <p className="text-gray-600 mb-8">
            서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
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
