import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/HXRC_Coding_Task_2025/',
  plugins: [react(), tailwindcss()]
})
