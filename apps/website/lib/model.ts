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
  type ApiParameterListMixin,
  type ApiReturnTypeMixin,
} from '@microsoft/api-extractor-model';
import type { DocNode, DocComment } from '@microsoft/tsdoc';
import type { DocPackage, DocMember, DocChild, DocParam, SearchEntry } from './types';

const MODEL_FILES = [
  'packages/types/docs/types.api.json',
  'packages/rest/docs/rest.api.json',
  'packages/builders/docs/builders.api.json',
  'packages/telegram.js/docs/telegramxjs.api.json',
];

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

function signatureOf(item: ApiItem): string {
  const excerpt = (item as ApiDeclaredItem).excerpt;
  return excerpt ? excerpt.text.trim() : '';
}

function packageSlug(fullName: string): string {
  return fullName.split('/').pop() ?? fullName;
}

const CONTAINER_KINDS = new Set([ApiItemKind.Class, ApiItemKind.Interface]);

function childrenOf(item: ApiItem): DocChild[] {
  if (!CONTAINER_KINDS.has(item.kind)) return [];
  const children: DocChild[] = [];
  for (const member of item.members) {
    const child: DocChild = {
      name: member.displayName,
      kind: member.kind,
      signature: signatureOf(member),
      summary: summaryOf(member),
    };
    if (member.kind === ApiItemKind.Method || member.kind === ApiItemKind.MethodSignature) {
      const m = member as ApiMethod | ApiMethodSignature;
      child.params = (m as unknown as ApiParameterListMixin).parameters.map(
        (p): DocParam => ({ name: p.name, type: p.parameterTypeExcerpt.text.trim(), optional: p.isOptional }),
      );
      child.returnType = (m as unknown as ApiReturnTypeMixin).returnTypeExcerpt.text.trim();
    }
    children.push(child);
  }
  return children;
}

function heritageOf(item: ApiItem): string | undefined {
  if (item.kind === ApiItemKind.Class) {
    const cls = item as ApiClass;
    const parts: string[] = [];
    if (cls.extendsType) parts.push(`extends ${cls.extendsType.excerpt.text.trim()}`);
    if (cls.implementsTypes.length)
      parts.push(`implements ${cls.implementsTypes.map(t => t.excerpt.text.trim()).join(', ')}`);
    return parts.join(' ') || undefined;
  }
  if (item.kind === ApiItemKind.Interface) {
    const iface = item as ApiInterface;
    if (iface.extendsTypes.length)
      return `extends ${iface.extendsTypes.map(t => t.excerpt.text.trim()).join(', ')}`;
  }
  return undefined;
}

let cached: DocPackage[] | null = null;

/** Load and normalize every package's api-extractor model. Cached per process. */
export function loadDocs(): DocPackage[] {
  if (cached) return cached;
  const model = new ApiModel();
  const packages: DocPackage[] = [];

  for (const rel of MODEL_FILES) {
    const file = join(process.cwd(), '..', '..', rel);
    if (!existsSync(file)) continue;
    const apiPackage = model.loadPackage(file);
    const slug = packageSlug(apiPackage.name);
    const entryPoint = apiPackage.entryPoints[0];
    if (!entryPoint) continue;

    const members: DocMember[] = entryPoint.members
      .filter(m => m.kind !== ApiItemKind.None)
      .map(m => ({
        name: m.displayName,
        kind: m.kind,
        slug: m.displayName,
        packageSlug: slug,
        summary: summaryOf(m),
        signature: signatureOf(m),
        heritage: heritageOf(m),
        children: childrenOf(m),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    packages.push({ name: apiPackage.name, slug, members });
  }

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
