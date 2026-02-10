import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // To deploy to https://<USERNAME>.github.io/<REPO>/
  // set base to '/<REPO>/'
  base: '/ai-test/', 
})
