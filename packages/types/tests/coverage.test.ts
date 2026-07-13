import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { API_VERSION, METHOD_NAMES, TYPE_NAMES } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(readFileSync(join(__dirname, '..', 'vendor', 'api.json'), 'utf8'));

describe('generated core coverage', () => {
  it('matches the pinned spec version', () => {
    expect(API_VERSION).toBe(spec.version);
  });

  it('covers every method in the spec', () => {
    expect([...METHOD_NAMES].sort()).toEqual(Object.keys(spec.methods).sort());
  });

  it('covers every type in the spec', () => {
    expect([...TYPE_NAMES].sort()).toEqual(Object.keys(spec.types).sort());
  });
});
