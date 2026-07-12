'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '../lib/types';

export function Search({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(e => e.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.toLowerCase().indexOf(q) - b.name.toLowerCase().indexOf(q))
      .slice(0, 30);
  }, [query, index]);

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search the API…"
        className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-brand dark:border-zinc-700"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {results.map(r => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => setQuery('')}
                className="flex items-center justify-between px-3 py-1.5 text-sm no-underline hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <span className="text-zinc-900 dark:text-zinc-100">{r.name}</span>
                <span className="text-xs text-zinc-500">{r.packageSlug}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
