import { notFound } from 'next/navigation';
import { loadDocs, getMember } from '../../../../lib/model';
import { MemberView } from '../../../../components/MemberView';
import { Toc } from '../../../../components/Toc';

export function generateStaticParams() {
  return loadDocs().flatMap(pkg => pkg.members.map(m => ({ package: pkg.slug, member: m.slug })));
}

export default function MemberPage({ params }: { params: { package: string; member: string } }) {
  const member = getMember(params.package, decodeURIComponent(params.member));
  if (!member) notFound();

  const properties = member.children
    .filter(c => c.kind === 'Property' || c.kind === 'PropertySignature')
    .map(c => c.name);
  const methods = member.children
    .filter(c => c.kind === 'Method' || c.kind === 'MethodSignature' || c.kind === 'Constructor')
    .map(c => c.name);

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <MemberView member={member} />
      </div>
      <Toc properties={properties} methods={methods} />
    </div>
  );
}
