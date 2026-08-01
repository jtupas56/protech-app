import { test, expect } from '@playwright/test'

const baseUrl = process.env.BASE_URL ?? 'https://protech-app-chi.vercel.app'

test.describe('Deployed app home page', () => {
    test('should load public home page', async ({ page }) => {
        await page.goto(baseUrl)

        await expect(page).toHaveTitle(/Protech Notes/i)
        await expect(page.getByRole('heading', { name: /Protech Notes/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /Contact Us/i })).toBeVisible()
    })

    test('should navigate to contact page from home', async ({ page }) => {
        await page.goto(baseUrl)
        await page.getByRole('link', { name: /Contact Us/i }).click()

        await expect(page).toHaveURL(/\/contact$/)
        await expect(page.getByRole('heading', { name: /Contact Us/i })).toBeVisible()
    })
})
