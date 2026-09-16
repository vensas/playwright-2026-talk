import { test, expect } from '@playwright/test';

test.describe('Deploy or Die - Failed Deployment', () => {
  test('should show error message when deployment fails', async ({ page }) => {
    // Mock the API to always return failure
    await page.route('**/api/deploy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: '💥 BOOM! The database just went on vacation. Permanently.',
          deployedBy: 'Unlucky Developer',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await page.goto('/');

    // Fill in deployer name
    await page.getByLabel(/Who dares to deploy/i).fill('Unlucky Developer');
    await page.getByRole('button', { name: /Deploy Now/i }).click();

    // Verify error message appears
    await expect(page.getByText(/BOOM! The database/i)).toBeVisible();
    await expect(page.getByText(/Unlucky Developer/i)).toBeVisible();
  });

  test('should handle various error messages', async ({ page }) => {
    // Each pass through the loop starts a deployment, so the cooldown applies.
    await page.clock.install();
    await page.goto('/');

    const errorMessages = [
      '💥 BOOM! The database just went on vacation.',
      '🔥 Production is on fire!',
      '💣 Critical failure!',
    ];

    for (const errorMsg of errorMessages) {
      // Mock API with different error message
      await page.route('**/api/deploy', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: errorMsg,
            deployedBy: 'Test User',
            timestamp: new Date().toISOString(),
          }),
        });
      });

      await page.clock.fastForward('00:30');
      await page.getByLabel(/Who dares to deploy/i).fill('Test User');
      await page.getByRole('button', { name: /Deploy Now/i }).click();

      // Verify the specific error message
      await expect(page.getByText(new RegExp(errorMsg.slice(0, 20), 'i'))).toBeVisible();
    }
  });

  test('should handle API connection errors', async ({ page }) => {
    // Mock the API to fail (network error)
    await page.route('**/api/deploy', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Network Tester');
    await page.getByRole('button', { name: /Deploy Now/i }).click();

    // Verify connection error message appears
    await expect(page.getByText(/Failed to connect to the deployment server/i)).toBeVisible();
  });
});
