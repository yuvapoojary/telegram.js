'use client';

import { useEffect, useMemo, useState } from 'react';

function TocSection({ title, items, active }: { title: string; items: string[]; active: string }) {
  if (!items.length) return null;
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
      <ul className="space-y-0.5">
        {items.map(id => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block truncate text-xs no-underline transition ${
                active === id ? 'font-medium text-brand' : 'text-zinc-500 hover:text-brand'
              }`}
            >
              {id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Toc({ properties, methods }: { properties: string[]; methods: string[] }) {
  const [active, setActive] = useState('');
  const all = useMemo(() => [...properties, ...methods], [properties, methods]);

  useEffect(() => {
    if (!all.length) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    for (const id of all) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [all]);

  if (!properties.length && !methods.length) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="scrollbar-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">On this page</p>
        <TocSection title="Properties" items={properties} active={active} />
        <TocSection title="Methods" items={methods} active={active} />
      </div>
    </aside>
  );
}
