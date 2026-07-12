import type { ReactNode } from 'react';
import Link from 'next/link';
import { loadDocs, searchIndex } from '../../lib/model';
import { Search } from '../../components/Search';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const packages = loadDocs();
  const index = searchIndex();

  return (
    <div className="flex gap-8 py-8">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto pr-2">
          <Search index={index} />
          <nav className="mt-4 space-y-4 text-sm">
            {packages.map(pkg => (
              <div key={pkg.slug}>
                <Link href={`/docs/${pkg.slug}/`} className="font-semibold text-zinc-900 no-underline dark:text-zinc-100">
                  {pkg.name}
                </Link>
                <ul className="mt-1 space-y-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                  {pkg.members.slice(0, 40).map(m => (
                    <li key={m.slug}>
                      <Link
                        href={`/docs/${pkg.slug}/${m.slug}/`}
                        className="block truncate py-0.5 text-zinc-600 no-underline hover:text-brand dark:text-zinc-400"
                      >
                        {m.name}
                      </Link>
                    </li>
                  ))}
                  {pkg.members.length > 40 && (
                    <li className="py-0.5 text-xs text-zinc-500">+ {pkg.members.length - 40} more…</li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
