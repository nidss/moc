import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base ตั้งเป็นชื่อ repo เพื่อให้ deploy บน GitHub Pages (https://nidss.github.io/moc/) ได้
export default defineConfig({
  base: process.env.VITE_BASE ?? '/moc/',
  plugins: [react(), tailwindcss()],
})
