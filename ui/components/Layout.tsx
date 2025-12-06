import { cn } from '@/lib/utils';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isSidebarOpen?: boolean;
}

const Layout = ({ children, isSidebarOpen = true }: LayoutProps) => {
  return (
    <main
      className={cn(
        'bg-light-primary dark:bg-dark-primary min-h-screen transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'lg:pl-20' : 'lg:pl-0',
      )}
    >
      <div className="max-w-screen-lg lg:mx-auto mx-4">{children}</div>
    </main>
  );
};

export default Layout;
