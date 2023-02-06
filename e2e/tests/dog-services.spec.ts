import { test, expect } from '@playwright/test';

test.describe('Dog Grooming Application', () => {
  test('Add a dog and verify it appears in services', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Navigate to Dogs page
    await page.getByRole('link', { name: 'My Dogs' }).click();

    // Click "Add Dog" button to open dialog
    await page.getByRole('button', { name: 'Add Dog' }).click();

    // Fill in the dog form
    await page.locator('#name').fill('Buddy');
    await page.locator('#dob').fill('2020-01-15');
    await page.locator('#weight').fill('30');
    await page.locator('#breed').selectOption('golden-retriever');
    await page.locator('button[type="submit"]').click();

    // Reload the page to trigger a fresh fetch (workaround for hybrid RTK Query/thunk setup)
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'My Dogs' }).click();

    // Wait for the dog to appear in the list
    await expect(page.locator('h3.dogName').filter({ hasText: 'Buddy' })).toBeVisible();

    // Select the newly added dog as the lucky dog using the dropdown
    await page.locator('#luckyDog').selectOption({ label: 'Buddy' });

    // Navigate to Services page
    await page.getByRole('link', { name: 'Services' }).click();

    // Verify that we see the dog name mentioned and the lucky dog component is visible
    await expect(page.locator('p').filter({ hasText: /Buddy/i })).toBeVisible();
    await expect(page.locator('.luckyDogComponent')).toBeVisible();
  });

  test('Navigate to services without dogs shows all services', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Navigate directly to Services page
    await page.getByRole('link', { name: 'Services' }).click();

    // Verify message about showing all services
    await expect(page.locator('p').filter({ hasText: /showing all/i })).toBeVisible();
    expect(await page.locator('.card').count()).toBeGreaterThan(0);
  });
});
