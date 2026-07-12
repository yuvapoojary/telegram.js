import type { DocMember, DocChild } from '../lib/types';

/** Minimal renderer for the markdown-ish summaries produced by lib/model. */
function Prose({ text }: { text: string }) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split(/(`[^`]+`)/).map((part, j) =>
            part.startsWith('`') && part.endsWith('`') ? (
              <code key={j} className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}

function Signature({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 text-xs leading-relaxed dark:bg-zinc-900">
      <code>{code}</code>
    </pre>
  );
}

function KindBadge({ kind }: { kind: string }) {
  return (
    <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">{kind.toLowerCase()}</span>
  );
}

function ChildView({ child }: { child: DocChild }) {
  return (
    <div id={child.name} className="scroll-mt-4 border-t border-zinc-200 py-4 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <h3 className="font-mono font-semibold">{child.name}</h3>
        <KindBadge kind={child.kind} />
      </div>
      {child.signature && <div className="mt-2"><Signature code={child.signature} /></div>}
      {child.params && child.params.length > 0 && (
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1 pr-4 font-medium">Parameter</th>
              <th className="py-1 font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {child.params.map(p => (
              <tr key={p.name} className="align-top">
                <td className="py-1 pr-4">
                  {p.name}
                  {p.optional && <span className="text-zinc-500">?</span>}
                </td>
                <td className="py-1 text-zinc-600 dark:text-zinc-400">{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-2">
        <Prose text={child.summary} />
      </div>
    </div>
  );
}

export function MemberView({ member }: { member: DocMember }) {
  const properties = member.children.filter(c => c.kind === 'Property' || c.kind === 'PropertySignature');
  const methods = member.children.filter(c => c.kind === 'Method' || c.kind === 'MethodSignature');

  return (
    <article>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{member.name}</h1>
        <KindBadge kind={member.kind} />
      </div>
      {member.heritage && <p className="mt-1 font-mono text-sm text-zinc-500">{member.heritage}</p>}

      <div className="mt-4">
        <Prose text={member.summary} />
      </div>

      {member.signature && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Declaration</h2>
          <Signature code={member.signature} />
        </section>
      )}

      {properties.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Properties</h2>
          {properties.map(c => (
            <ChildView key={c.name} child={c} />
          ))}
        </section>
      )}

      {methods.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Methods</h2>
          {methods.map(c => (
            <ChildView key={c.name} child={c} />
          ))}
        </section>
      )}
    </article>
  );
}
