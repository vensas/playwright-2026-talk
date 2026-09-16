import { test, expect } from '@playwright/test';

/**
 * Clock API tests.
 *
 * The app prevents a second deployment for 30 seconds. A test must not wait
 * 30 seconds of real time. `page.clock` controls `Date.now()`, `setTimeout`
 * and `setInterval` in the page, thus the test moves the time forward itself.
 */
test.describe('Deploy or Die - Cooldown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/deploy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '🎉 Deployment successful!',
          deployedBy: 'Clock Tester',
          timestamp: new Date().toISOString(),
        }),
      });
    });
  });

  test('the cooldown blocks a second deployment', async ({ page }) => {
    // `install` must come before every other clock call.
    await page.clock.install();
    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Clock Tester');
    const deployButton = page.getByRole('button', { name: /Deploy Now/i });
    await deployButton.click();

    await expect(page.getByText(/Deployment successful/i)).toBeVisible();

    // The button now shows the countdown and is not available.
    const cooldownButton = page.getByRole('button', { name: /Next deploy in/i });
    await expect(cooldownButton).toBeVisible();
    await expect(cooldownButton).toBeDisabled();
  });

  test('the countdown decreases each second', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Clock Tester');
    await page.getByRole('button', { name: /Deploy Now/i }).click();
    await expect(page.getByText(/Deployment successful/i)).toBeVisible();

    await expect(page.getByRole('button', { name: /Next deploy in 30s/i })).toBeVisible();

    // `runFor` moves the time forward and lets the timers run.
    await page.clock.runFor(5_000);
    await expect(page.getByRole('button', { name: /Next deploy in 25s/i })).toBeVisible();
  });

  test('the button becomes available again after 30 seconds', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Clock Tester');
    await page.getByRole('button', { name: /Deploy Now/i }).click();
    await expect(page.getByText(/Deployment successful/i)).toBeVisible();

    // `fastForward` skips the full cooldown. The test needs milliseconds,
    // not 30 seconds.
    await page.clock.fastForward('00:30');

    await expect(page.getByRole('button', { name: /Deploy Now/i })).toBeEnabled();
  });
});
