/** Normalized, JSON-serializable documentation model consumed by the pages. */

export interface DocParam {
  name: string;
  type: string;
  optional: boolean;
}

export interface DocChild {
  name: string;
  kind: string;
  signature: string;
  summary: string;
  params?: DocParam[];
  returnType?: string;
}

export interface DocMember {
  name: string;
  kind: string;
  slug: string;
  packageSlug: string;
  summary: string;
  signature: string;
  heritage?: string;
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
