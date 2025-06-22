import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.NEXT_PUBLIC_KAKAO_REST_API_KEY = '${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || ''}';
            `
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
} 