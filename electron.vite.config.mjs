import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin({
      protectedStrings: [
        '88991238',
      ]
    }), externalizeDepsPlugin()]
  },
  preload: {
    plugins: [bytecodePlugin({
      protectedStrings: [
        '88991238',
      ]
    }), externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
