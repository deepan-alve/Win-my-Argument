'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Search, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';
import Layout from './Layout';
import SettingsDialog from './SettingsDialog';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const refreshPage = () => {
    window.location.href = '/';
  };

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Home',
    },
    {
      icon: BookOpenText,
      href: '/library',
      active: segments.includes('library'),
      label: 'Library',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col bg-white dark:bg-black">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 px-2 py-8" style={{ width: '80px' }}>
          <button
            onClick={refreshPage}
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <Plus className="cursor-pointer" />
          </button>
          
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-row items-center justify-center cursor-pointer duration-150 transition w-full py-2 rounded-lg',
                  link.active
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400',
                )}
              >
                <link.icon />
                {link.active && (
                  <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-gray-900 dark:bg-white" />
                )}
              </Link>
            ))}
          </VerticalIconContainer>

          <Settings
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          />

          <SettingsDialog
            isOpen={isSettingsOpen}
            setIsOpen={setIsSettingsOpen}
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm lg:hidden">
        <button
          onClick={refreshPage}
          className={cn(
            'relative flex flex-row items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 duration-150 transition py-2 rounded-lg',
            'text-gray-600 dark:text-gray-400'
          )}
        >
          <Plus />
        </button>
        {navLinks.map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-gray-900 dark:bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
