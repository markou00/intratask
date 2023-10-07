import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Needed for Mantine DataTable to work without problems
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
});
