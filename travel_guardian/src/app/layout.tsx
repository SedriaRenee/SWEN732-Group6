import type { Metadata } from 'next';
import { Josefin_Sans, Noto_Sans_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const josefinSans = Josefin_Sans({
  variable: '--font-josefin-sans',
  subsets: ['latin'],
});

const notoSansMono = Noto_Sans_Mono({
  variable: '--font-noto-sans-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Travel Guardian',
  description: 'Learn about the world and travel safely',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="root" className={`${josefinSans.variable} ${notoSansMono.variable} antialiased  bg-background`}
      >
        <Navbar />
        <div className="p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
