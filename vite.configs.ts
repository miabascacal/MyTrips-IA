import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Process shim for libraries expecting node env
    'process.env': {}
  }
});
