import Head from 'next/head';
import HomeScreen from '@/components/HomeScreen';

export default function Home() {
  return (
    <>
      <Head>
        <title>오늘 메뉴 추천 (오메추)</title>
      </Head>
      <HomeScreen />
    </>
  );
} 
