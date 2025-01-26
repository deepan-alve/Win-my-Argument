'use client';

import { useTheme } from './ThemeProvider';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="scale-75 transform">
      <DarkModeToggle
        mode={theme}
        dark="Dark"
        light="Light"
        size="sm"
        inactiveTrackColor="#e2e8f0"
        inactiveTrackColorOnHover="#f8fafc"
        inactiveTrackColorOnActive="#cbd5e1"
        activeTrackColor="#334155"
        activeTrackColorOnHover="#1e293b"
        activeTrackColorOnActive="#0f172a"
        inactiveThumbColor="#1e293b"
        activeThumbColor="#e2e8f0"
        onChange={(mode) => {
          if (mode !== theme) {
            toggleTheme();
          }
        }}
      />
    </div>
  );
}
