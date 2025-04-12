import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // Optionally, you can specify a port for the dev server (default is 3000)
    // port: 3000,
    proxy: {
      // Forward any requests starting with /tasks to your Flask backend
      '/tasks': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // Forward any requests starting with /add-task to your Flask backend
      '/add-task': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
