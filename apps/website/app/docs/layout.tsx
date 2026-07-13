import type { ReactNode } from 'react';
import { navTree, searchIndex } from '../../lib/model';
import { Sidebar } from '../../components/Sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = navTree();
  const index = searchIndex();

  return (
    <div className="lg:flex lg:gap-8 lg:py-8">
      <Sidebar tree={tree} index={index} />
      <div className="min-w-0 flex-1 py-6 lg:py-0">{children}</div>
    </div>
  );
}
