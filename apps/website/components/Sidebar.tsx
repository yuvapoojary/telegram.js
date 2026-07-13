'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { NavPackage, NavGroup, SearchEntry } from '../lib/types';
import { Search } from './Search';

/** Groups larger than this start collapsed (unless they contain the active page). */
const COLLAPSE_THRESHOLD = 25;

function isActivePath(pathname: string, pkgSlug: string, slug: string): boolean {
  const base = `/docs/${pkgSlug}/${slug}`;
  return pathname === base || pathname === `${base}/`;
}

function Group({
  pkgSlug,
  group,
  pathname,
  forceOpen,
}: {
  pkgSlug: string;
  group: NavGroup;
  pathname: string;
  forceOpen: boolean;
}) {
  const containsActive = group.members.some(m => isActivePath(pathname, pkgSlug, m.slug));
  const [open, setOpen] = useState(forceOpen || containsActive || group.members.length <= COLLAPSE_THRESHOLD);

  useEffect(() => {
    if (forceOpen || containsActive) setOpen(true);
  }, [forceOpen, containsActive]);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <span>{group.label}</span>
        <span className="font-normal text-zinc-400">
          {group.members.length} {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <ul className="mb-2 space-y-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-800">
          {group.members.map(m => {
            const active = isActivePath(pathname, pkgSlug, m.slug);
            return (
              <li key={m.slug}>
                <Link
                  href={`/docs/${pkgSlug}/${m.slug}/`}
                  className={`block truncate rounded px-2 py-0.5 no-underline transition ${
                    active
                      ? 'bg-brand/10 font-medium text-brand'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`}
                >
                  {m.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SidebarNav({
  tree,
  index,
  pathname,
}: {
  tree: NavPackage[];
  index: SearchEntry[];
  pathname: string;
}) {
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();

  const filtered = useMemo<NavPackage[]>(() => {
    if (!q) return tree;
    return tree
      .map(pkg => ({
        ...pkg,
        groups: pkg.groups
          .map(g => ({ ...g, members: g.members.filter(m => m.name.toLowerCase().includes(q)) }))
          .filter(g => g.members.length > 0),
      }))
      .filter(pkg => pkg.groups.length > 0);
  }, [tree, q]);

  return (
    <div>
      <Search index={index} />
      <input
        type="search"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter members…"
        className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-brand dark:border-zinc-700"
      />
      <nav className="mt-5 space-y-6 text-sm">
        {filtered.map(pkg => (
          <div key={pkg.slug}>
            <Link
              href={`/docs/${pkg.slug}/`}
              className="font-mono font-semibold text-zinc-900 no-underline hover:text-brand dark:text-zinc-100"
            >
              {pkg.name}
            </Link>
            <div className="mt-1.5 space-y-1">
              {pkg.groups.map(g => (
                <Group key={g.label} pkgSlug={pkg.slug} group={g} pathname={pathname} forceOpen={q.length > 0} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-xs text-zinc-500">No matches.</p>}
      </nav>
    </div>
  );
}

export function Sidebar({ tree, index }: { tree: NavPackage[]; index: SearchEntry[] }) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = <SidebarNav tree={tree} index={index} pathname={pathname} />;

  return (
    <>
      {/* Mobile menu bar */}
      <div className="sticky top-14 z-20 -mx-4 flex items-center border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
          aria-label="Open navigation"
        >
          ☰ Menu
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="scrollbar-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto pr-2">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-auto bg-white p-4 shadow-xl transition-transform lg:hidden dark:bg-zinc-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
