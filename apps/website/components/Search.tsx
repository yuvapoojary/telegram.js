'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchEntry } from '../lib/types';
import { KindBadge } from './KindBadge';

export function Search({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(e => e.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.toLowerCase().indexOf(q) - b.name.toLowerCase().indexOf(q))
      .slice(0, 30);
  }, [query, index]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Focus on "/" from anywhere (unless typing in a field).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
      // Only the visible instance (offsetParent is null when hidden/off-canvas) reacts.
      if (e.key === '/' && !typing && inputRef.current?.offsetParent) {
        e.preventDefault();
        inputRef.current.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => (s + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => (s - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[selected];
      if (r) {
        setQuery('');
        router.push(r.href);
      }
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search the API…  ( / )"
        className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-brand dark:border-zinc-700"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {results.map((r, i) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => setQuery('')}
                onMouseEnter={() => setSelected(i)}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 text-sm no-underline ${
                  i === selected ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-zinc-900 dark:text-zinc-100">{r.name}</span>
                  <KindBadge kind={r.kind} />
                </span>
                <span className="shrink-0 text-xs text-zinc-500">{r.packageSlug}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
