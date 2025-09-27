import { test, expect } from '@playwright/test';

test.describe('Property Details E2E Tests', () => {
  let propertyId: string;

  test.beforeEach(async ({ page }) => {
    // Go to homepage and get a property ID
    await page.goto('/');
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Click on the first property to get its ID
    const firstProperty = page.locator('[data-testid="property-card"]').first();
    await firstProperty.click();
    
    // Extract property ID from URL
    await page.waitForURL(/\/properties\/\d+/);
    const url = page.url();
    propertyId = url.split('/').pop() || '1';
  });

  test('should display complete property details', async ({ page }) => {
    // Verify we're on the property detail page
    expect(page.url()).toContain(`/properties/${propertyId}`);
    
    // Wait for property details to load
    await page.waitForSelector('[data-testid="property-detail"]', { timeout: 10000 });
    
    // Verify essential property information is displayed
    await expect(page.locator('[data-testid="property-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-address"]')).toBeVisible();
    
    // Verify property code and year are displayed
    await expect(page.locator('[data-testid="property-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-year"]')).toBeVisible();
  });

  test('should display owner information', async ({ page }) => {
    // Wait for owner section to load
    await page.waitForSelector('[data-testid="owner-section"]', { timeout: 10000 });
    
    // Verify owner information is displayed
    await expect(page.locator('[data-testid="owner-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="owner-address"]')).toBeVisible();
    
    // Check if owner photo is displayed (might be placeholder)
    const ownerPhoto = page.locator('[data-testid="owner-photo"]');
    if (await ownerPhoto.isVisible()) {
      // Verify the image loads properly
      await expect(ownerPhoto).toHaveAttribute('src', /.+/);
    }
  });

  test('should display property images gallery', async ({ page }) => {
    // Wait for images section
    await page.waitForSelector('[data-testid="images-section"]', { timeout: 10000 });
    
    // Check if images are displayed
    const propertyImages = page.locator('[data-testid="property-image"]');
    const imageCount = await propertyImages.count();
    
    if (imageCount > 0) {
      // Verify first image is visible and loads
      await expect(propertyImages.first()).toBeVisible();
      await expect(propertyImages.first()).toHaveAttribute('src', /.+/);
      
      // Test image navigation if multiple images exist
      if (imageCount > 1) {
        const nextButton = page.getByRole('button', { name: /next|siguiente/i });
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(500);
          // Verify navigation worked by checking if a different image is now active
        }
      }
    } else {
      // Verify placeholder or "no images" message is shown
      const noImagesMessage = page.locator('[data-testid="no-images"]').or(
        page.locator('text=/sin imágenes|no images/i')
      );
      await expect(noImagesMessage).toBeVisible();
    }
  });

  test('should display transaction history', async ({ page }) => {
    // Wait for traces/history section
    await page.waitForSelector('[data-testid="traces-section"]', { timeout: 10000 });
    
    // Check if transaction history is displayed
    const transactionRows = page.locator('[data-testid="transaction-row"]');
    const transactionCount = await transactionRows.count();
    
    if (transactionCount > 0) {
      // Verify transaction information is displayed
      const firstTransaction = transactionRows.first();
      await expect(firstTransaction.locator('[data-testid="transaction-date"]')).toBeVisible();
      await expect(firstTransaction.locator('[data-testid="transaction-name"]')).toBeVisible();
      await expect(firstTransaction.locator('[data-testid="transaction-value"]')).toBeVisible();
      await expect(firstTransaction.locator('[data-testid="transaction-tax"]')).toBeVisible();
    } else {
      // Verify "no history" message is shown
      const noHistoryMessage = page.locator('[data-testid="no-history"]').or(
        page.locator('text=/sin historial|no history/i')
      );
      await expect(noHistoryMessage).toBeVisible();
    }
  });

  test('should have working back navigation', async ({ page }) => {
    // Look for back button or breadcrumb
    const backButton = page.getByRole('button', { name: /back|volver|atrás/i }).or(
      page.getByRole('link', { name: /back|volver|home|inicio/i })
    );
    
    if (await backButton.isVisible()) {
      await backButton.click();
      
      // Verify we're back to the property listing
      await expect(page).toHaveURL(/\/$|\/properties$/);
      await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible();
    } else {
      // Test browser back button
      await page.goBack();
      await expect(page).toHaveURL(/\/$|\/properties$/);
    }
  });

  test('should handle invalid property ID gracefully', async ({ page }) => {
    // Navigate to non-existent property
    await page.goto('/properties/99999');
    
    // Wait for error state
    await page.waitForTimeout(3000);
    
    // Check for 404 or "not found" message
    const notFoundMessage = page.locator('[data-testid="not-found"]').or(
      page.locator('text=/no encontrado|not found|404/i')
    );
    
    await expect(notFoundMessage).toBeVisible({ timeout: 10000 });
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for property details to load
    await page.waitForSelector('[data-testid="property-detail"]', { timeout: 10000 });
    
    // Verify essential elements are visible and properly sized
    await expect(page.locator('[data-testid="property-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-price"]')).toBeVisible();
    
    // Check that content doesn't overflow
    const propertyDetail = page.locator('[data-testid="property-detail"]');
    const detailBox = await propertyDetail.boundingBox();
    if (detailBox) {
      expect(detailBox.width).toBeLessThanOrEqual(375);
    }
    
    // Verify that images adapt to mobile layout
    const imageSection = page.locator('[data-testid="images-section"]');
    if (await imageSection.isVisible()) {
      const imageBox = await imageSection.boundingBox();
      if (imageBox) {
        expect(imageBox.width).toBeLessThanOrEqual(375);
      }
    }
  });

  test('should load property details via direct URL', async ({ page }) => {
    // Navigate directly to property detail page
    await page.goto(`/properties/${propertyId}`);
    
    // Verify page loads correctly
    await page.waitForSelector('[data-testid="property-detail"]', { timeout: 10000 });
    
    // Verify essential information is displayed
    await expect(page.locator('[data-testid="property-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="property-price"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept property detail API call and make it fail
    await page.route(`**/api/properties/${propertyId}`, route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' })
      });
    });
    
    // Navigate to property detail page
    await page.goto(`/properties/${propertyId}`);
    
    // Wait and check for error message
    await page.waitForTimeout(3000);
    
    const errorMessage = page.locator('[data-testid="error-message"]').or(
      page.locator('text=/error|no se pudo cargar/i')
    );
    
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to property detail page
    await page.goto(`/properties/${propertyId}`);
    
    // Check for loading indicator (might be brief)
    const loadingIndicator = page.locator('[data-testid="loading"]').or(
      page.locator('text=/cargando|loading/i')
    );
    
    // Loading might be visible briefly
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeHidden({ timeout: 10000 });
    }
    
    // Verify content loaded
    await expect(page.locator('[data-testid="property-detail"]')).toBeVisible({ timeout: 10000 });
  });
});