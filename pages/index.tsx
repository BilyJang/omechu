import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>오늘 메뉴 추천 (오메추)</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            오늘 메뉴 추천 (오메추)
          </h1>
          <p className="text-xl text-gray-600">
            Components 폴더 업로드 중...
          </p>
        </div>
      </div>
    </>
  );
}
