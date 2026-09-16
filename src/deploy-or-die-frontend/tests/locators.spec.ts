import { test, expect } from '@playwright/test';

/**
 * Locator tests.
 *
 * A locator says WHAT you want, not HOW to find it. Playwright finds the
 * element again for each action and waits until the element is ready.
 * This is why a Playwright test needs no `sleep`.
 */
test.describe('Deploy or Die - Locators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('role based locators read like the user interface', async ({ page }) => {
    // Preferred order: role, label, text. These stay correct when the
    // CSS classes or the DOM structure change.
    await expect(page.getByRole('heading', { name: /Deploy or Die/i })).toBeVisible();
    await expect(page.getByLabel(/Who dares to deploy/i)).toBeEditable();
    await expect(page.getByRole('button', { name: /Deploy Now/i })).toBeEnabled();
  });

  test('auto-wait removes the need for a sleep', async ({ page }) => {
    await page.route('**/api/deploy', async (route) => {
      // The answer comes late, but the test does not wait manually.
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '🎉 Deployment successful!',
          deployedBy: 'Patient Dev',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await page.getByLabel(/Who dares to deploy/i).fill('Patient Dev');
    await page.getByRole('button', { name: /Deploy Now/i }).click();

    // `expect` tries again until the timeout. No `waitForTimeout` is necessary.
    await expect(page.getByText(/Deployment successful/i)).toBeVisible();
  });

  test('visible() selects only the elements that the user sees', async ({ page }) => {
    // New in 1.63: `visible()` keeps only the visible matches. Before 1.63 you
    // wrote `.filter({ visible: true })`.
    const visibleButtons = page.getByRole('button').visible();

    await expect(visibleButtons.first()).toBeVisible();
    expect(await visibleButtons.count()).toBeGreaterThan(0);
  });

  test('an ARIA snapshot records the structure of the page', async ({ page }) => {
    // The snapshot shows roles and names, not CSS. It is easy to read in a
    // review, and it fails when the structure changes.
    await expect(page.locator('.card-header')).toMatchAriaSnapshot(`
      - heading /Deploy or Die/ [level=1]
      - paragraph: /Every deployment is a gamble/
    `);
  });
});
