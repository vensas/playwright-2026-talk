// A snippet for playwright-cli. Run it against the open app:
//   playwright-cli open http://localhost:3000
//   playwright-cli run-code --filename=agent-snippets/cooldown.js
// One call does what an agent otherwise does with ten tool calls.
async page => {
  await page.route('**/api/deploy', route =>
    route.fulfill({ json: { success: false, message: 'BOOM' } }));
  await page.clock.install();
  await page.reload();
  await page.getByLabel(/Who dares to deploy/i).fill('Agent');
  await page.getByRole('button', { name: /Deploy Now/i }).click();
  await page.getByText('BOOM').waitFor();
  const during = await page.locator('.deploy-button').textContent();
  await page.clock.runFor('00:30');
  const after = await page.locator('.deploy-button').textContent();
  return { during, after };
}
