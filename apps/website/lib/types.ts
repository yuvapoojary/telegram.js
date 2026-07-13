/** Normalized, JSON-serializable documentation model consumed by the pages. */

/** Fine-grained token kind used to drive syntax-highlight colors. */
export type TokenKind = 'text' | 'keyword' | 'reference' | 'punctuation' | 'string';

/** A single piece of a signature. `href` is set only for resolvable type references. */
export interface TypeToken {
  text: string;
  kind: TokenKind;
  href?: string;
}

export interface DocParam {
  name: string;
  /** Plain-text type, kept for search/copy. */
  type: string;
  /** Tokenized type for highlighted, cross-linked rendering. */
  typeTokens: TypeToken[];
  optional: boolean;
}

export interface DocChild {
  name: string;
  kind: string;
  /** Plain-text signature, kept for search/copy. */
  signature: string;
  signatureTokens: TypeToken[];
  summary: string;
  params?: DocParam[];
  returnType?: string;
  returnTypeTokens?: TypeToken[];
}

export interface DocMember {
  name: string;
  kind: string;
  slug: string;
  packageSlug: string;
  summary: string;
  /** Plain-text signature, kept for search/copy and page titles. */
  signature: string;
  signatureTokens: TypeToken[];
  heritage?: string;
  heritageTokens?: TypeToken[];
  children: DocChild[];
}

export interface DocPackage {
  name: string;
  slug: string;
  members: DocMember[];
}

export interface SearchEntry {
  name: string;
  kind: string;
  packageSlug: string;
  href: string;
}

/** A lightweight nav entry (name + slug only) for the sidebar tree. */
export interface NavEntry {
  name: string;
  slug: string;
}

/** Members of one package grouped by kind bucket, for the sidebar. */
export interface NavGroup {
  /** Display label, e.g. "Classes", "Interfaces". */
  label: string;
  members: NavEntry[];
}

export interface NavPackage {
  name: string;
  slug: string;
  groups: NavGroup[];
}
