import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
    plugins: [
        svelte({ hot: !process.env.VITEST }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        includeSource: ["src/**/*.{js, ts, svelte"]
    },
    resolve: {
        alias: {
            $app: path.resolve('./.svelte-kit/runtime/app'),
            $lib: path.resolve('./src/lib'),
            $utils: path.resolve('./src/utils')
        }
    }
})