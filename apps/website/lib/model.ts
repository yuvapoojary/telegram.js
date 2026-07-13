import { join } from 'node:path';
import { existsSync } from 'node:fs';
import {
  ApiModel,
  ApiItem,
  ApiItemKind,
  ApiDeclaredItem,
  ApiDocumentedItem,
  ApiClass,
  ApiInterface,
  ApiMethod,
  ApiMethodSignature,
  ExcerptToken,
  ExcerptTokenKind,
  type ApiParameterListMixin,
  type ApiReturnTypeMixin,
} from '@microsoft/api-extractor-model';
import type { DocNode, DocComment } from '@microsoft/tsdoc';
import type {
  DocPackage,
  DocMember,
  DocChild,
  DocParam,
  SearchEntry,
  TypeToken,
  TokenKind,
  NavPackage,
} from './types';

const MODEL_FILES = [
  'packages/types/docs/types.api.json',
  'packages/rest/docs/rest.api.json',
  'packages/builders/docs/builders.api.json',
  'packages/telegram.js/docs/telegramxjs.api.json',
];

/** Package slugs that own doc pages (used to gate cross-links). */
const KNOWN_SLUGS = new Set(['types', 'rest', 'builders', 'telegramxjs']);

/** TypeScript keywords / built-in types colored as keywords in signatures. */
const KEYWORDS = new Set([
  'readonly', 'export', 'declare', 'abstract', 'extends', 'implements', 'new', 'keyof', 'typeof',
  'public', 'private', 'protected', 'static', 'get', 'set', 'async', 'function', 'class', 'interface',
  'type', 'enum', 'const', 'namespace', 'import', 'in', 'infer', 'is', 'as',
  'void', 'string', 'number', 'boolean', 'null', 'undefined', 'any', 'unknown', 'never', 'this',
  'object', 'symbol', 'bigint', 'true', 'false',
]);

/** Render a TSDoc node tree into a compact markdown-ish string. */
function renderDocNode(node: DocNode | undefined): string {
  if (!node) return '';
  switch (node.kind) {
    case 'PlainText':
      return (node as unknown as { text: string }).text;
    case 'SoftBreak':
      return ' ';
    case 'CodeSpan':
      return `\`${(node as unknown as { code: string }).code}\``;
    case 'FencedCode':
      return `\n\n\`\`\`\n${(node as unknown as { code: string }).code}\n\`\`\`\n\n`;
    case 'LinkTag':
      return (node as unknown as { linkText?: string }).linkText ?? '';
    case 'Paragraph':
      return node.getChildNodes().map(renderDocNode).join('') + '\n\n';
    default:
      return node.getChildNodes().map(renderDocNode).join('');
  }
}

function summaryOf(item: ApiItem): string {
  const comment = (item as ApiDocumentedItem).tsdocComment as DocComment | undefined;
  if (!comment) return '';
  return renderDocNode(comment.summarySection).trim();
}

function packageSlug(fullName: string): string {
  return fullName.split('/').pop() ?? fullName;
}

/**
 * Resolve an api-extractor `canonicalReference` (e.g. `@telegramxjs/types!ApiMethods:interface`)
 * to an internal doc URL, or `undefined` for external/unknown references.
 */
function resolveHref(canonical: string | undefined, known: Set<string>): string | undefined {
  if (!canonical) return undefined;
  const bang = canonical.indexOf('!');
  if (bang <= 0) return undefined; // external ref (starts with '!') or malformed
  const pkgName = canonical.slice(0, bang);
  const rest = canonical.slice(bang + 1);
  const memberName = rest.split(/[:#.(]/, 1)[0];
  if (!memberName) return undefined;
  const slug = pkgName.split('/').pop() ?? pkgName;
  if (!KNOWN_SLUGS.has(slug)) return undefined;
  if (!known.has(`${slug}:${memberName}`)) return undefined;
  return `/docs/${slug}/${memberName}/`;
}

/** Split a plain content string into finer, color-classified tokens. */
function splitContent(text: string): TypeToken[] {
  const out: TypeToken[] = [];
  const re = /('[^']*'|"[^"]*"|`[^`]*`)|(\w+)|(\s+)|([^\w\s])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) out.push({ text: m[1], kind: 'string' });
    else if (m[2] !== undefined) out.push({ text: m[2], kind: KEYWORDS.has(m[2]) ? 'keyword' : 'text' });
    else if (m[3] !== undefined) out.push({ text: m[3], kind: 'text' });
    else if (m[4] !== undefined) out.push({ text: m[4], kind: 'punctuation' });
  }
  return out;
}

/** Convert api-extractor excerpt tokens into cross-linked, color-classified tokens. */
function toTypeTokens(tokens: readonly ExcerptToken[], known: Set<string>): TypeToken[] {
  const out: TypeToken[] = [];
  for (const t of tokens) {
    if (t.kind === ExcerptTokenKind.Reference) {
      const href = resolveHref(t.canonicalReference?.toString(), known);
      out.push({ text: t.text, kind: 'reference', href });
    } else {
      out.push(...splitContent(t.text));
    }
  }
  return out;
}

function signatureStringOf(item: ApiItem): string {
  const excerpt = (item as ApiDeclaredItem).excerpt;
  return excerpt ? excerpt.text.trim() : '';
}

function signatureTokensOf(item: ApiItem, known: Set<string>): TypeToken[] {
  const excerpt = (item as ApiDeclaredItem).excerpt;
  return excerpt ? toTypeTokens(excerpt.spannedTokens, known) : [];
}

function kw(text: string): TypeToken {
  return { text, kind: 'keyword' as TokenKind };
}

function heritageTokensOf(item: ApiItem, known: Set<string>): TypeToken[] | undefined {
  if (item.kind === ApiItemKind.Class) {
    const cls = item as ApiClass;
    const out: TypeToken[] = [];
    if (cls.extendsType) {
      out.push(kw('extends '), ...toTypeTokens(cls.extendsType.excerpt.spannedTokens, known));
    }
    if (cls.implementsTypes.length) {
      if (out.length) out.push({ text: ' ', kind: 'text' });
      out.push(kw('implements '));
      cls.implementsTypes.forEach((t, i) => {
        if (i > 0) out.push({ text: ', ', kind: 'punctuation' });
        out.push(...toTypeTokens(t.excerpt.spannedTokens, known));
      });
    }
    return out.length ? out : undefined;
  }
  if (item.kind === ApiItemKind.Interface) {
    const iface = item as ApiInterface;
    if (!iface.extendsTypes.length) return undefined;
    const out: TypeToken[] = [kw('extends ')];
    iface.extendsTypes.forEach((t, i) => {
      if (i > 0) out.push({ text: ', ', kind: 'punctuation' });
      out.push(...toTypeTokens(t.excerpt.spannedTokens, known));
    });
    return out;
  }
  return undefined;
}

const CONTAINER_KINDS = new Set([ApiItemKind.Class, ApiItemKind.Interface]);

function childrenOf(item: ApiItem, known: Set<string>): DocChild[] {
  if (!CONTAINER_KINDS.has(item.kind)) return [];
  const children: DocChild[] = [];
  for (const member of item.members) {
    const child: DocChild = {
      name: member.displayName,
      kind: member.kind,
      signature: signatureStringOf(member),
      signatureTokens: signatureTokensOf(member, known),
      summary: summaryOf(member),
    };
    if (member.kind === ApiItemKind.Method || member.kind === ApiItemKind.MethodSignature) {
      const m = member as ApiMethod | ApiMethodSignature;
      child.params = (m as unknown as ApiParameterListMixin).parameters.map(
        (p): DocParam => ({
          name: p.name,
          type: p.parameterTypeExcerpt.text.trim(),
          typeTokens: toTypeTokens(p.parameterTypeExcerpt.spannedTokens, known),
          optional: p.isOptional,
        }),
      );
      const returnExcerpt = (m as unknown as ApiReturnTypeMixin).returnTypeExcerpt;
      child.returnType = returnExcerpt.text.trim();
      child.returnTypeTokens = toTypeTokens(returnExcerpt.spannedTokens, known);
    }
    children.push(child);
  }
  return children;
}

let cached: DocPackage[] | null = null;

/** Load and normalize every package's api-extractor model. Cached per process. */
export function loadDocs(): DocPackage[] {
  if (cached) return cached;
  const model = new ApiModel();
  const loaded: { name: string; slug: string; entryMembers: readonly ApiItem[] }[] = [];

  for (const rel of MODEL_FILES) {
    const file = join(process.cwd(), '..', '..', rel);
    if (!existsSync(file)) continue;
    const apiPackage = model.loadPackage(file);
    const slug = packageSlug(apiPackage.name);
    const entryPoint = apiPackage.entryPoints[0];
    if (!entryPoint) continue;
    const entryMembers = entryPoint.members.filter(m => m.kind !== ApiItemKind.None);
    loaded.push({ name: apiPackage.name, slug, entryMembers });
  }

  // Pass 1: collect every documented member so cross-links can be validated.
  const known = new Set<string>();
  for (const { slug, entryMembers } of loaded) {
    for (const m of entryMembers) known.add(`${slug}:${m.displayName}`);
  }

  // Pass 2: build the tokenized doc model.
  const packages: DocPackage[] = loaded.map(({ name, slug, entryMembers }) => {
    const members: DocMember[] = entryMembers
      .map((m): DocMember => {
        const heritageTokens = heritageTokensOf(m, known);
        return {
          name: m.displayName,
          kind: m.kind,
          slug: m.displayName,
          packageSlug: slug,
          summary: summaryOf(m),
          signature: signatureStringOf(m),
          signatureTokens: signatureTokensOf(m, known),
          heritage: heritageTokens?.map(t => t.text).join(''),
          heritageTokens,
          children: childrenOf(m, known),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { name, slug, members };
  });

  cached = packages;
  return packages;
}

export function getPackage(slug: string): DocPackage | undefined {
  return loadDocs().find(p => p.slug === slug);
}

export function getMember(packageSlug: string, memberSlug: string): DocMember | undefined {
  return getPackage(packageSlug)?.members.find(m => m.slug === memberSlug);
}

/** A flat search index across every documented member. */
export function searchIndex(): SearchEntry[] {
  return loadDocs().flatMap(pkg =>
    pkg.members.map(m => ({
      name: m.name,
      kind: m.kind,
      packageSlug: pkg.slug,
      href: `/docs/${pkg.slug}/${m.slug}/`,
    })),
  );
}

/** Order in which kind-groups appear in the sidebar. */
const KIND_GROUP_ORDER = ['Classes', 'Interfaces', 'Functions', 'Type Aliases', 'Variables', 'Enums', 'Other'];

function groupLabel(kind: string): string {
  switch (kind) {
    case ApiItemKind.Class:
      return 'Classes';
    case ApiItemKind.Interface:
      return 'Interfaces';
    case ApiItemKind.Function:
      return 'Functions';
    case ApiItemKind.TypeAlias:
      return 'Type Aliases';
    case ApiItemKind.Variable:
      return 'Variables';
    case ApiItemKind.Enum:
      return 'Enums';
    default:
      return 'Other';
  }
}

/** Lightweight package → kind-group → member tree for the sidebar (names/slugs only). */
export function navTree(): NavPackage[] {
  return loadDocs().map(pkg => {
    const byLabel = new Map<string, { name: string; slug: string }[]>();
    for (const m of pkg.members) {
      const label = groupLabel(m.kind);
      const list = byLabel.get(label) ?? [];
      list.push({ name: m.name, slug: m.slug });
      byLabel.set(label, list);
    }
    const groups = KIND_GROUP_ORDER.filter(l => byLabel.has(l)).map(label => ({
      label,
      members: byLabel.get(label)!,
    }));
    return { name: pkg.name, slug: pkg.slug, groups };
  });
}
