import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@telegramxjs/types': fileURLToPath(new URL('../types/src/index.ts', import.meta.url)),
    },
  },
});
