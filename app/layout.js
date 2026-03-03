import './globals.scss';

import MyQueryClientProvider from "@/providers/my-query-client";

export const metadata = {
  title: '賭大細',
  description: '',
  openGraph: {
    title: 'Taisai',
    description: 'Experience the thrill of Taisai, the exciting multiplayer game! Compete in real-time battles and rise through the ranks.',
    images: ['https://nextjs-daisai.vercel.app/images/ogimage.png'],
  }, icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='main'>
          <MyQueryClientProvider>{children}</MyQueryClientProvider>
        </div>
      </body>

    </html >
  );
}
