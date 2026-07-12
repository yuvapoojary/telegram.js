import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadDocs, getPackage } from '../../../lib/model';

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
      <h1 className="font-mono text-3xl font-bold">{pkg.name}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{pkg.members.length} exports</p>

      {[...byKind.entries()].map(([kind, members]) => (
        <section key={kind} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{kind}</h2>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 md:grid-cols-3">
            {members.map(m => (
              <li key={m.slug}>
                <Link href={`/docs/${pkg.slug}/${m.slug}/`} className="font-mono text-sm no-underline hover:text-brand">
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
