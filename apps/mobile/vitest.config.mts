import { defineConfig } from 'vitest/config';

// Unit tests cover pure TypeScript in src/lib only (no React Native imports).
export default defineConfig({
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
