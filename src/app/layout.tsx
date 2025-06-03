import './globals.css'; // Your global Tailwind CSS imports
import { Inter } from 'next/font/google'; // Example font import

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tuskee',
  description: 'Order management system for Exaltech'
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}