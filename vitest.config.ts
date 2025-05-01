import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
    test: {
        globals: true,
        environment: 'node'
    }
})