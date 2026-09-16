import { test, expect } from '@playwright/test';

/**
 * Retry tests.
 *
 * The app enforces a 30 second cooldown between two deployments. Each test
 * installs the clock and moves the time forward, instead of a real wait.
 */
test.describe('Deploy or Die - Retry Logic', () => {
  test('should retry deployment and handle mixed success/failure', async ({ page }) => {
    let attemptCount = 0;
    await page.route('**/api/deploy', async (route) => {
      attemptCount++;
      const success = attemptCount % 2 === 0; // Success on even attempts

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success,
          message: success
            ? `✨ Attempt ${attemptCount}: Success!`
            : `💥 Attempt ${attemptCount}: Failed!`,
          deployedBy: 'Persistent Dev',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await page.clock.install();
    await page.goto('/');

    const nameInput = page.getByLabel(/Who dares to deploy/i);
    const deployButton = page.getByRole('button', { name: /Deploy Now/i });

    // Attempt 1 - should fail
    await nameInput.fill('Persistent Dev');
    await deployButton.click();
    await expect(page.getByText(/Attempt 1: Failed/i)).toBeVisible();

    // Attempt 2 - should succeed
    await page.clock.fastForward('00:30');
    await deployButton.click();
    await expect(page.getByText(/Attempt 2: Success/i)).toBeVisible();

    // Attempt 3 - should fail again
    await page.clock.fastForward('00:30');
    await deployButton.click();
    await expect(page.getByText(/Attempt 3: Failed/i)).toBeVisible();
  });

  test('should handle consecutive deployments', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/deploy', async (route) => {
      requestCount++;
      // Add slight delay to simulate real API
      await new Promise((resolve) => setTimeout(resolve, 100));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: `Request ${requestCount} completed`,
          deployedBy: 'Speed Tester',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await page.clock.install();
    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Speed Tester');

    const deployButton = page.getByRole('button', { name: /Deploy Now/i });
    await deployButton.click();
    await expect(page.getByText(/Request 1 completed/i)).toBeVisible();

    await page.clock.fastForward('00:30');
    await deployButton.click();
    await expect(page.getByText(/Request 2 completed/i)).toBeVisible();

    // Verify correct number of API calls
    expect(requestCount).toBe(2);
  });
});
