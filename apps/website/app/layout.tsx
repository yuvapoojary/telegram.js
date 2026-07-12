import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'telegram.js',
  description: 'A powerful, fully-typed Node.js library for the Telegram Bot API.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold text-zinc-900 no-underline dark:text-zinc-100">
              telegram<span className="text-brand">.js</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/docs/">Docs</Link>
              <a href="https://core.telegram.org/bots/api" target="_blank" rel="noreferrer">
                Bot API
              </a>
              <a href="https://github.com/yuvapoojary/telegram.js" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4">{children}</main>
      </body>
    </html>
  );
}
