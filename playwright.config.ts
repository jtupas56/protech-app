import type { PlaywrightTestConfig } from '@playwright/test'

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
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
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
    reporter: [
        ['list'],
        ['github'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],
}

export default config
