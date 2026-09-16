import { test, expect } from '@playwright/test';

/**
 * Integration tests against the real ASP.NET Core backend and a real
 * PostgreSQL database. Docker Compose starts both, see `testcontainers.ts`.
 *
 * All tests here write to the same database. `lock` (new in 1.63) makes sure
 * that two tests which hold the same lock name never run at the same time,
 * across files and across workers. The other tests keep their parallel speed.
 */
test.describe('Deploy or Die - Integration Tests with Real Backend', { lock: 'deploy-db' }, () => {
  test.beforeEach(async ({ page }) => {
    // Point the frontend at the backend that Compose started.
    await page.addInitScript((url) => {
      (window as any).BACKEND_URL = url;
    }, process.env.API_URL);
  });

  test('should deploy successfully against real backend', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/Who dares to deploy/i).fill('Integration Tester');
    await page.getByRole('button', { name: /Deploy Now/i }).click();

    // The real backend gives success or failure, each with a 50% chance.
    // Thus assert the structure, not the result.
    const resultMessage = page.locator('.result-message');
    await expect(resultMessage).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/Deployed by:/i)).toBeVisible();
    await expect(page.getByText(/Integration Tester/i)).toBeVisible();
    await expect(page.getByText(/Time:/i)).toBeVisible();
  });

  test('should handle validation with real backend', async ({ page }) => {
    await page.goto('/');

    // Deploy without a name. The frontend must stop this.
    await page.getByRole('button', { name: /Deploy Now/i }).click();

    await expect(page.getByText(/Please enter your name before deploying/i)).toBeVisible();
  });

  test('the API rejects a request without a deployer name', async ({ request }) => {
    // Playwright speaks HTTP directly. No browser is necessary to test the API
    // contract of the ASP.NET Core minimal API.
    const response = await request.post(`${process.env.API_URL}/api/deploy`, {
      data: { deployerName: '' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('required');
  });

  test('the API stores the target environment', async ({ request }) => {
    const response = await request.post(`${process.env.API_URL}/api/deploy`, {
      data: { deployerName: 'API Tester', environment: 'staging' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.deployedBy).toBe('API Tester');
    expect(body.environment).toBe('staging');
  });
});
