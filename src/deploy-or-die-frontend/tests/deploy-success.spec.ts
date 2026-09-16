import { test, expect } from '@playwright/test';

test.describe('Deploy or Die - Successful Deployment', () => {
  test('should deploy successfully and show success message', async ({ page }) => {
    // Mock the API to always return success - MUST be before goto
    await page.route('**/api/deploy', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '🎉 Deployment successful! The servers are purring like kittens.',
          deployedBy: 'John Doe',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    await page.goto('/');

    // Verify initial state
    await expect(page.getByRole('heading', { name: /Deploy or Die/i })).toBeVisible();
    await expect(page.getByText(/Every deployment is a gamble/i)).toBeVisible();

    // Fill in deployer name
    const nameInput = page.getByLabel(/Who dares to deploy/i);
    await nameInput.fill('John Doe');

    // Click deploy button
    const deployButton = page.getByRole('button', { name: /Deploy Now/i });
    await deployButton.click();

    // Verify success message appears (loading state is too fast with mocked API)
    await expect(page.getByText(/Deployment successful/i)).toBeVisible();
    await expect(page.getByText(/John Doe/i)).toBeVisible();

    // Verify deployment info is displayed
    await expect(page.getByText(/Deployed by:/i)).toBeVisible();
    await expect(page.getByText(/Time:/i)).toBeVisible();
  });

  test('should handle multiple successful deployments', async ({ page }) => {
    // Mock API for success
    let deploymentCount = 0;
    await page.route('**/api/deploy', async (route) => {
      deploymentCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: `🎉 Deployment #${deploymentCount} successful!`,
          deployedBy: 'Repeat Deployer',
          timestamp: new Date().toISOString(),
        }),
      });
    });

    // The app blocks a second deployment for 30 seconds. The clock moves the
    // time forward, thus the test stays fast.
    await page.clock.install();
    await page.goto('/');

    // First deployment
    await page.getByLabel(/Who dares to deploy/i).fill('Repeat Deployer');
    await page.getByRole('button', { name: /Deploy Now/i }).click();
    await expect(page.getByText(/Deployment #1 successful/i)).toBeVisible();

    // Second deployment
    await page.clock.fastForward('00:30');
    await page.getByRole('button', { name: /Deploy Now/i }).click();
    await expect(page.getByText(/Deployment #2 successful/i)).toBeVisible();
  });
});
