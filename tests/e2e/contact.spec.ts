import { test, expect } from '@playwright/test'

const baseUrl = process.env.BASE_URL ?? 'https://protech-app-chi.vercel.app'

test.describe('Contact page', () => {
    test('should load contact page', async ({ page }) => {
        await page.goto(`${baseUrl}/contact`)

        await expect(page).toHaveURL(/\/contact$/)
        await expect(page.getByRole('heading', { name: /Contact (Sales|Us)/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /Let\'s talk|Send Message/i })).toBeVisible()
    })

    test('should submit contact form and reset fields', async ({ page }) => {
        await page.goto(`${baseUrl}/contact`)

        await page.evaluate(() => {
            const typedWindow = window as Window & { lastAlertMessage?: string }
            window.alert = (message: string) => {
                typedWindow.lastAlertMessage = message
                return true
            }
        })

        if (await page.locator('#first-name').count()) {
            await page.fill('#first-name', 'Playwright')
            await page.fill('#last-name', 'Tester')
            await page.fill('#company', 'Test Corp')
            await page.fill('#email', 'playwright@example.com')
            await page.fill('#phone-number', '123-456-7890')
            await page.fill('#message', 'This is a test submission.')
            await page.check('#agree-to-policies')
            await page.click('button:has-text("Let\'s talk")')

            await expect(page.locator('#first-name')).toHaveValue('')
            await expect(page.locator('#last-name')).toHaveValue('')
            await expect(page.locator('#company')).toHaveValue('')
            await expect(page.locator('#email')).toHaveValue('')
            await expect(page.locator('#phone-number')).toHaveValue('')
            await expect(page.locator('#message')).toHaveValue('')
        } else {
            await page.fill('#name', 'Playwright Tester')
            await page.fill('#email', 'playwright@example.com')
            await page.fill('#message', 'This is a test submission.')
            await page.click('button:has-text("Send Message")')

            await expect(page.locator('#name')).toHaveValue('')
            await expect(page.locator('#email')).toHaveValue('')
            await expect(page.locator('#message')).toHaveValue('')
        }

        const alertText = await page.evaluate(() => (window as Window & { lastAlertMessage?: string }).lastAlertMessage)
        await expect(alertText).toContain('Thank you for your message')
    })
})
