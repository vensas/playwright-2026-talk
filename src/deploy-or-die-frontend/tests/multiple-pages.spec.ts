import { test, expect, type BrowserContext, type Page } from '@playwright/test';

/**
 * Tests with more than one page.
 *
 * A page is one tab. A browser context is one user: it has its own cookies,
 * its own storage and its own routes. All pages in a context share the routes
 * of that context. See https://playwright.dev/docs/pages#multiple-pages.
 */

/** Replaces the API for all pages in the context. */
async function mockDeploy(context: BrowserContext) {
  await context.route('**/api/deploy', async (route) => {
    const { deployerName } = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: '🎉 Deployment successful!',
        deployedBy: deployerName,
        timestamp: new Date().toISOString(),
      }),
    });
  });
}

async function deploy(page: Page, name: string) {
  await page.getByLabel(/Who dares to deploy/i).fill(name);
  await page.getByRole('button', { name: /Deploy Now/i }).click();
}

test.describe('Deploy or Die - Multiple pages', () => {
  test('two tabs share the routes, not the cooldown', async ({ context }) => {
    // One route on the context applies to each page in it.
    await mockDeploy(context);
    const [first, second] = await Promise.all([context.newPage(), context.newPage()]);
    await Promise.all([first.goto('/'), second.goto('/')]);

    await deploy(first, 'Tab One');

    // The cooldown is in the state of the first tab only.
    await expect(first.getByRole('button', { name: /Next deploy in/i })).toBeDisabled();
    await expect(second.getByRole('button', { name: /Deploy Now/i })).toBeEnabled();
  });

  test('two users deploy at the same time', async ({ browser }) => {
    // Each context is a separate user with an empty session.
    const alice = await browser.newContext();
    const bob = await browser.newContext();
    await Promise.all([mockDeploy(alice), mockDeploy(bob)]);

    const [alicePage, bobPage] = await Promise.all([alice.newPage(), bob.newPage()]);
    await Promise.all([alicePage.goto('/'), bobPage.goto('/')]);

    // Both users click at the same time.
    await Promise.all([deploy(alicePage, 'Alice'), deploy(bobPage, 'Bob')]);

    await expect(alicePage.getByText(/Deployed by: Alice/i)).toBeVisible();
    await expect(bobPage.getByText(/Deployed by: Bob/i)).toBeVisible();

    await Promise.all([alice.close(), bob.close()]);
  });
});
