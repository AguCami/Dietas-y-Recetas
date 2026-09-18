import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` tiene que coincidir con el nombre del repo para que GitHub Pages
// encuentre los assets: la app se sirve en usuario.github.io/Dietas-y-Recetas/
export default defineConfig({
  base: '/Dietas-y-Recetas/',
  plugins: [react(), tailwindcss()],
})
