import { test, expect } from '@playwright/test'

const baseUrl = 'https://protech-app-chi.vercel.app'
const clerkTestUsername = process.env.CLERK_TEST_USERNAME
const clerkTestPassword = process.env.CLERK_TEST_PASSWORD
const clerkCredentialsAvailable = !!clerkTestUsername && !!clerkTestPassword

test.describe('Deployed app smoke test', () => {
    test('should load public home page', async ({ page }) => {
        await page.goto(baseUrl)
        await expect(page).toHaveTitle(/Protech Notes/i)
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 10000 })
    })

    test('should sign in with Clerk test user', async ({ page }) => {
        test.skip(!clerkCredentialsAvailable, 'CLERK_TEST_USERNAME and CLERK_TEST_PASSWORD are required for login smoke test')

        await page.goto(baseUrl)
        await expect(page).toHaveTitle(/Protech Notes/i)

        await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 10000 })
        await page.click('button:has-text("Sign In")')

        const usernameInput = page.locator('input[placeholder="Enter your username"], input[name="identifier"]')
        const passwordInput = page.locator('input[placeholder="Enter your password"], input[name="password"]')
        const continueButton = page.getByRole('button', { name: 'Continue', exact: true })

        await expect(usernameInput).toBeVisible({ timeout: 15000 })
        await usernameInput.fill(clerkTestUsername!)
        await expect(passwordInput).toBeVisible({ timeout: 10000 })
        await passwordInput.fill(clerkTestPassword!)

        await Promise.all([
            page.waitForResponse(response => response.url().includes('/clerk/') || response.status() === 200).catch(() => null),
            continueButton.click(),
        ])

        await expect(page.locator('button:has-text("Sign In"), button:has-text("Sign Up")')).toHaveCount(0)
    })
})
