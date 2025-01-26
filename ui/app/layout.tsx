import type { Metadata } from 'next';
import { Montserrat, Dancing_Script } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: 'WMA - Chat with the internet',
  description:
    'WMA is an AI powered chatbot that is connected to the internet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-white dark:bg-black antialiased', montserrat.className, dancingScript.variable)}>
        <ThemeProvider>
          <Sidebar>{children}</Sidebar>
          <Toaster 
            toastOptions={{
              className: 'dark:bg-black dark:text-white bg-white text-gray-900',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
