import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadDocs, getPackage } from '../../../lib/model';
import { KindBadge } from '../../../components/KindBadge';

export function generateStaticParams() {
  return loadDocs().map(pkg => ({ package: pkg.slug }));
}

export default function PackagePage({ params }: { params: { package: string } }) {
  const pkg = getPackage(params.package);
  if (!pkg) notFound();

  const byKind = new Map<string, typeof pkg.members>();
  for (const m of pkg.members) {
    const list = byKind.get(m.kind) ?? [];
    list.push(m);
    byKind.set(m.kind, list);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-bold">{pkg.name}</h1>
        <span className="rounded bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-500">
          {pkg.members.length} exports
        </span>
      </div>

      {[...byKind.entries()].map(([kind, members]) => (
        <section key={kind} className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{kind}</h2>
            <KindBadge kind={kind} />
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-3">
            {members.map(m => (
              <li key={m.slug}>
                <Link
                  href={`/docs/${pkg.slug}/${m.slug}/`}
                  className="block truncate rounded-md border border-transparent px-2 py-1 font-mono text-sm text-zinc-700 no-underline transition hover:border-zinc-200 hover:text-brand dark:text-zinc-300 dark:hover:border-zinc-800"
                >
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
