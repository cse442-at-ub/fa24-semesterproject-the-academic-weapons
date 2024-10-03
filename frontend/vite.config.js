import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/CSE442/2024-Fall/cse-442an/"
  // base: "/CSE442/2024-Fall/journeys/"
  // base: "/CSE442/2024-Fall/zcsanger/"
})