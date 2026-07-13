/** Per-kind badge colors. Full class strings are kept literal so Tailwind can detect them. */
const KIND_STYLES: Record<string, string> = {
  Class: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  Interface: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Function: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  TypeAlias: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Variable: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  Enum: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  Property: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  PropertySignature: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  Method: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  MethodSignature: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Constructor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

const KIND_LABEL: Record<string, string> = {
  TypeAlias: 'type',
  MethodSignature: 'method',
  PropertySignature: 'property',
};

export function KindBadge({ kind, className = '' }: { kind: string; className?: string }) {
  const style = KIND_STYLES[kind] ?? 'bg-brand/10 text-brand';
  const label = KIND_LABEL[kind] ?? kind.toLowerCase();
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${style} ${className}`}>{label}</span>
  );
}
