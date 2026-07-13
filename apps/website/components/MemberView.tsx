import type { DocMember, DocChild } from '../lib/types';
import { TypeTokens, TokenizedSignature } from './TypeTokens';
import { KindBadge } from './KindBadge';

/** Minimal renderer for the markdown-ish summaries produced by lib/model. */
function Prose({ text }: { text: string }) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
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

function ChildView({ child }: { child: DocChild }) {
  return (
    <div id={child.name} className="group scroll-mt-24 border-t border-zinc-200 py-5 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <a
          href={`#${child.name}`}
          className="font-mono font-semibold text-zinc-900 no-underline dark:text-zinc-100"
        >
          {child.name}
        </a>
        <KindBadge kind={child.kind} />
        <a
          href={`#${child.name}`}
          aria-label="Direct link"
          className="text-zinc-300 no-underline opacity-0 transition hover:text-brand group-hover:opacity-100 dark:text-zinc-600"
        >
          #
        </a>
      </div>

      {child.signatureTokens.length > 0 && (
        <div className="mt-2">
          <TokenizedSignature tokens={child.signatureTokens} />
        </div>
      )}

      {child.params && child.params.length > 0 && (
        <table className="mt-3 w-full text-left text-xs">
          <thead className="text-zinc-500">
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-1.5 pr-4 font-medium">Parameter</th>
              <th className="py-1.5 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {child.params.map(p => (
              <tr key={p.name} className="align-top">
                <td className="py-1.5 pr-4 font-mono">
                  {p.name}
                  {p.optional && <span className="text-zinc-500">?</span>}
                </td>
                <td className="py-1.5 font-mono">
                  <TypeTokens tokens={p.typeTokens} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {child.returnTypeTokens && child.returnTypeTokens.length > 0 && (
        <div className="mt-3 text-xs">
          <span className="font-medium uppercase tracking-wide text-zinc-500">Returns </span>
          <span className="font-mono">
            <TypeTokens tokens={child.returnTypeTokens} />
          </span>
        </div>
      )}

      <div className="mt-3">
        <Prose text={child.summary} />
      </div>
    </div>
  );
}

export function MemberView({ member }: { member: DocMember }) {
  const properties = member.children.filter(c => c.kind === 'Property' || c.kind === 'PropertySignature');
  const methods = member.children.filter(
    c => c.kind === 'Method' || c.kind === 'MethodSignature' || c.kind === 'Constructor',
  );

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-bold">{member.name}</h1>
        <KindBadge kind={member.kind} />
      </div>
      {member.heritageTokens && member.heritageTokens.length > 0 && (
        <p className="mt-2 font-mono text-sm">
          <TypeTokens tokens={member.heritageTokens} />
        </p>
      )}

      <div className="mt-4">
        <Prose text={member.summary} />
      </div>

      {member.signatureTokens.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Declaration</h2>
          <TokenizedSignature tokens={member.signatureTokens} />
        </section>
      )}

      {properties.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Properties</h2>
          {properties.map(c => (
            <ChildView key={c.name} child={c} />
          ))}
        </section>
      )}

      {methods.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Methods</h2>
          {methods.map(c => (
            <ChildView key={c.name} child={c} />
          ))}
        </section>
      )}
    </article>
  );
}
