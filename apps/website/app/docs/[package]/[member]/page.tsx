import { notFound } from 'next/navigation';
import { loadDocs, getMember } from '../../../../lib/model';
import { MemberView } from '../../../../components/MemberView';

export function generateStaticParams() {
  return loadDocs().flatMap(pkg => pkg.members.map(m => ({ package: pkg.slug, member: m.slug })));
}

export default function MemberPage({ params }: { params: { package: string; member: string } }) {
  const member = getMember(params.package, decodeURIComponent(params.member));
  if (!member) notFound();
  return <MemberView member={member} />;
}
