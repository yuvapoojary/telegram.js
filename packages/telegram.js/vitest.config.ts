import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@telegramxjs/types': fileURLToPath(new URL('../types/src/index.ts', import.meta.url)),
      '@telegramxjs/rest': fileURLToPath(new URL('../rest/src/index.ts', import.meta.url)),
      '@telegramxjs/builders': fileURLToPath(new URL('../builders/src/index.ts', import.meta.url)),
    },
  },
});
