import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
   server: {
    https: false, 
    port: 5173,
    cors: true,
    cookieDomainRewrite: "",
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false,
    },
  },
  },
});