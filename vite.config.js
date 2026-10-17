import { defineConfig } from 'vite';

// Relative base so the build works both at a domain root (Vercel)
// and under a sub-path (GitHub Pages: /<repo>/).
export default defineConfig({
  base: './',
});
