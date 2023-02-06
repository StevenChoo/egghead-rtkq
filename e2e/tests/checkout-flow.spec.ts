import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('Complete checkout flow: add dog, select services, and checkout', async ({ page }) => {
    await page.goto('/');

    // Step 1: Go to My Dogs page
    await page.getByRole('link', { name: 'My Dogs' }).click();
    await expect(page).toHaveURL('/dogs');

    // Step 2: Click "Add Dog"
    await page.getByRole('button', { name: 'Add Dog' }).click();

    // Step 3: Fill in the dog form
    // Calculate date for 2 years old dog
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const dobString = twoYearsAgo.toISOString().split('T')[0];

    await page.locator('#name').fill('Pickles');
    await page.locator('#dob').fill(dobString);
    await page.locator('#weight').fill('35');
    await page.locator('#breed').selectOption('husky');

    // Step 3.5: Click "Add Dog"
    await page.locator('button[type="submit"]').click();

    // Wait for dog to be added and page to update
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 4: Go to services page
    await page.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');

    // Step 4.1: Select the dog (Pickles)
    // Wait for the dropdown to have the Pickles option
    await page.waitForSelector('#luckyDog option:has-text("Pickles")', { state: 'attached', timeout: 15000 });
    await page.locator('#luckyDog').selectOption({ label: 'Pickles' });

    // Wait for services to filter based on selected dog
    await page.waitForTimeout(1000);

    // Step 5: Add 2 services to the cart
    // Click first "Add to Cart" button
    const addToCartButtons = page.locator('button:has-text("Add to Cart")');
    await addToCartButtons.first().click();

    // Wait a moment for state to update
    await page.waitForTimeout(200);

    // Click second "Add to Cart" button
    await addToCartButtons.nth(0).click();

    // Verify cart shows 2 items
    await expect(page.locator('.cartSummary')).toContainText('Cart: 2 items');

    // Step 6: Click "Checkout" button
    const checkoutButton = page.locator('button:has-text("Checkout")');
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    // Step 7: Verify we're on the checkout page
    // URL should match /checkout/:id pattern
    await page.waitForURL(/\/checkout\/.+/, { timeout: 15000 });

    // Wait for the page to fully load (not showing loader)
    await page.waitForSelector('h1:has-text("Checkout Successful")', { timeout: 15000 });

    // Step 8: Verify checkout page shows the correct information
    await expect(page.locator('h1')).toContainText('Checkout Successful');

    // Verify dog name is displayed
    await expect(page.locator('.checkoutDog')).toContainText('Pickles');

    // Verify services are listed
    const serviceItems = page.locator('.checkoutServiceItem');
    await expect(serviceItems).toHaveCount(2);

    // Verify total price is displayed
    await expect(page.locator('.checkoutTotal')).toBeVisible();
    await expect(page.locator('.totalPrice')).toBeVisible();
  });

  test('Checkout page shows error for invalid checkout ID', async ({ page }) => {
    await page.goto('/checkout/invalid-id');

    await expect(page.locator('h1')).toContainText('Checkout');
    await expect(page.locator('.page')).toContainText('Checkout not found or an error occurred');
  });
});
