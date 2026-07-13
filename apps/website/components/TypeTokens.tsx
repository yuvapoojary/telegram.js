import Link from 'next/link';
import type { TypeToken } from '../lib/types';

const KIND_CLASS: Record<string, string> = {
  keyword: 'tok-keyword',
  reference: 'tok-reference',
  punctuation: 'tok-punctuation',
  string: 'tok-string',
  text: 'tok-text',
};

/** Inline renderer: each token is a colored span, or a link when it resolves to a doc page. */
export function TypeTokens({ tokens }: { tokens: TypeToken[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.href ? (
          <Link key={i} href={t.href} className="tok-reference font-medium no-underline hover:underline">
            {t.text}
          </Link>
        ) : (
          <span key={i} className={KIND_CLASS[t.kind] ?? 'tok-text'}>
            {t.text}
          </span>
        ),
      )}
    </>
  );
}

/** Block renderer: a tokenized signature inside a code block. */
export function TokenizedSignature({ tokens }: { tokens: TypeToken[] }) {
  if (!tokens.length) return null;
  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed dark:border-zinc-800 dark:bg-zinc-900/60">
      <code className="font-mono">
        <TypeTokens tokens={tokens} />
      </code>
    </pre>
  );
}
