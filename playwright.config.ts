import type { PlaywrightTestConfig } from '@playwright/test'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const config: PlaywrightTestConfig = {
    testDir: './tests/e2e',
    timeout: 60 * 1000,
    expect: {
        timeout: 5000,
    },
    use: {
        headless: true,
        viewport: { width: 1280, height: 800 },
        actionTimeout: 10000,
        ignoreHTTPSErrors: true,
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
    reporter: [['list'], ['github']],
}

export default config
