import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'telegramx.js',
  description: 'A powerful, fully-typed Node.js library for the Telegram Bot API.',
};

/** Runs before paint to set the theme class, avoiding a flash of the wrong theme. */
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-lg font-semibold text-zinc-900 no-underline dark:text-zinc-100"
            >
              telegram<span className="text-brand">x.js</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/docs/" className="text-zinc-600 no-underline hover:text-brand dark:text-zinc-300">
                Docs
              </Link>
              <a
                href="https://core.telegram.org/bots/api"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 no-underline hover:text-brand dark:text-zinc-300"
              >
                Bot API
              </a>
              <a
                href="https://github.com/yuvapoojary/telegram.js"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 no-underline hover:text-brand dark:text-zinc-300"
              >
                GitHub
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4">{children}</main>
      </body>
    </html>
  );
}
