import Link from 'next/link';
import { loadDocs } from '../../lib/model';

export default function DocsIndex() {
  const packages = loadDocs();
  return (
    <div>
      <h1 className="text-3xl font-bold">API Reference</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Generated from the source of every package in the telegram.js monorepo.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {packages.map(pkg => (
          <Link
            key={pkg.slug}
            href={`/docs/${pkg.slug}/`}
            className="rounded-lg border border-zinc-200 p-5 no-underline hover:border-brand dark:border-zinc-800"
          >
            <h2 className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">{pkg.members.length} exports</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
