import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// package.jsonからbaseを取得して設定
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const base = packageJson.name

export default defineConfig({
  base: '/' + base + '/',
  plugins: [react()],
})
