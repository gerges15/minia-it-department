import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://graduationprojecthost.runasp.net',
    },
  },
  test: {
    environment: 'jsdom', // Make sure this is set to 'jsdom'
  },
});
