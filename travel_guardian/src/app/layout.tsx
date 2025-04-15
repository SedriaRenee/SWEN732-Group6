"use client"; 
import { usePathname } from 'next/navigation';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); 

  // Hide navbar on login and signup pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <head>
        <title> Travel Guardian </title>
      </head>
      <body id="root" className={`${josefinSans.variable} ${notoSansMono.variable}`}>
        {!hideNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
