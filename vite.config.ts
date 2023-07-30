import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '',
  build: {
    outDir: 'docs'
  },
  plugins: [preact()]
});
