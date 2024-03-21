import { nodeResolve } from '@rollup/plugin-node-resolve';

/**@type { import("rollup").RollupOptions } */
export default {
    plugins: [nodeResolve({
        exportConditions: ['node']
    })],
    input: ["src/index.js"],
    output: {
        dir: 'dist',
        format: 'iife',
        sourcemap: true
    },
    watch: {
        include: [
            "src/**/*"
        ]
    }
}