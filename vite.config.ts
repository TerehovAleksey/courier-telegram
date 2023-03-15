import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'rc-util/es/dom/isVisible': 'rc-util/es/Dom/isVisible',
    },
  },
  plugins: [react()],
  base: '/courier-telegram/'
})
