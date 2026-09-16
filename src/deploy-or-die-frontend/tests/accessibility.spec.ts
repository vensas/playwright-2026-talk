import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility tests.
 *
 * The European Accessibility Act applies since June 2025. Thus these checks
 * belong in the pipeline, not in a manual test at the end of the project.
 *
 * Important limit: an automatic scan finds about 30% to 50% of the WCAG
 * problems. It does not replace a manual test with a screen reader.
 */
test.describe('Deploy or Die - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Deploy or Die/i })).toBeVisible();
  });

  test('the deploy page has no WCAG 2.2 AA violations', async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    // Attach the full report, so that the CI result shows the details.
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    // A failed assertion prints the rule id and the element.
    expect(
      results.violations.map((violation) => ({
        rule: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target.join(' ')),
      }))
    ).toEqual([]);
  });

  test('the deploy form keeps its accessible structure', async ({ page }) => {
    // An ARIA snapshot asserts the accessibility tree, not the DOM. It finds
    // structural changes that axe-core permits, for example a heading level
    // that changes or a control that loses its role.
    await expect(page.locator('.card-header')).toMatchAriaSnapshot(`
      - heading /Deploy or Die/ [level=1]
      - paragraph: /Every deployment is a gamble/
    `);
  });

  test('a keyboard user can reach the deploy button', async ({ page }) => {
    await page.getByLabel(/Who dares to deploy/i).focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // The focus must land on a control that has an accessible name.
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    await expect(focused).not.toHaveAccessibleName('');
  });
});
