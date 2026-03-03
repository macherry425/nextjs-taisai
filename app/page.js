'use client';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('@/components/Game'), {
  ssr: false,
});
export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Daisai!</title>
        <link rel="icon" href="https://static.ably.dev/motif-red.svg?nextjs-vercel" type="image/svg+xml" />
      </Head>
      {/* <Chat /> */}
        <Game />
    </div>
  );
}
