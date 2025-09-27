import { test, expect } from '@playwright/test';

test.describe('Property Listing E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
  });

  test('should load homepage and display properties', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle(/Million Test Properties/);
    
    // Check that the main heading is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Check that at least one property card is visible
    const propertyCards = page.locator('[data-testid="property-card"]');
    await expect(propertyCards.first()).toBeVisible();
    
    // Verify property card contains required elements
    const firstCard = propertyCards.first();
    await expect(firstCard.locator('[data-testid="property-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="property-price"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="property-address"]')).toBeVisible();
  });

  test('should filter properties by price range', async ({ page }) => {
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Get initial count of properties
    const initialCount = await page.locator('[data-testid="property-card"]').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Find and fill price filter inputs
    const minPriceInput = page.locator('[data-testid="min-price-filter"]');
    const maxPriceInput = page.locator('[data-testid="max-price-filter"]');
    
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('200000');
      await maxPriceInput.fill('400000');
      
      // Apply filters
      await page.getByRole('button', { name: /aplicar|filter/i }).click();
      
      // Wait for filtered results
      await page.waitForTimeout(2000);
      
      // Verify that filtered results are shown
      const filteredCards = page.locator('[data-testid="property-card"]');
      const filteredCount = await filteredCards.count();
      
      // Check that prices are within the specified range
      for (let i = 0; i < Math.min(filteredCount, 3); i++) {
        const priceText = await filteredCards.nth(i).locator('[data-testid="property-price"]').textContent();
        if (priceText) {
          const price = parseInt(priceText.replace(/[^\d]/g, ''));
          expect(price).toBeGreaterThanOrEqual(200000);
          expect(price).toBeLessThanOrEqual(400000);
        }
      }
    }
  });

  test('should search properties by name', async ({ page }) => {
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Find search input
    const searchInput = page.locator('[data-testid="search-input"]').or(
      page.locator('input[placeholder*="buscar" i]')
    ).or(
      page.locator('input[placeholder*="search" i]')
    );
    
    if (await searchInput.isVisible()) {
      // Enter search term
      await searchInput.fill('Villa');
      
      // Wait for search results
      await page.waitForTimeout(2000);
      
      // Verify search results contain the search term
      const searchResults = page.locator('[data-testid="property-card"]');
      const resultCount = await searchResults.count();
      
      if (resultCount > 0) {
        // Check that at least one result contains "Villa" in the name
        const firstResult = searchResults.first();
        const propertyName = await firstResult.locator('[data-testid="property-name"]').textContent();
        expect(propertyName?.toLowerCase()).toContain('villa');
      }
    }
  });

  test('should navigate through pagination', async ({ page }) => {
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /next|siguiente|>/i });
    const paginationInfo = page.locator('[data-testid="pagination-info"]').or(
      page.locator('text=/página|page/i')
    );
    
    if (await nextButton.isVisible()) {
      // Get current page info
      const currentPageInfo = await paginationInfo.textContent();
      
      // Click next page
      await nextButton.click();
      
      // Wait for new page to load
      await page.waitForTimeout(2000);
      
      // Verify page changed
      const newPageInfo = await paginationInfo.textContent();
      expect(newPageInfo).not.toBe(currentPageInfo);
      
      // Verify properties loaded on new page
      await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible();
    }
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Check for loading indicator during initial load
    const loadingIndicator = page.locator('[data-testid="loading"]').or(
      page.locator('text=/cargando|loading/i')
    );
    
    // Loading indicator might be visible briefly
    if (await loadingIndicator.isVisible()) {
      // Wait for loading to complete
      await expect(loadingIndicator).toBeHidden({ timeout: 10000 });
    }
    
    // Verify content loaded
    await expect(page.locator('[data-testid="property-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });
    
    // Verify that property cards are still visible and properly sized
    const propertyCard = page.locator('[data-testid="property-card"]').first();
    await expect(propertyCard).toBeVisible();
    
    // Check that the card doesn't overflow the viewport
    const cardBox = await propertyCard.boundingBox();
    if (cardBox) {
      expect(cardBox.width).toBeLessThanOrEqual(375);
    }
    
    // Verify that essential elements are still accessible
    await expect(propertyCard.locator('[data-testid="property-name"]')).toBeVisible();
    await expect(propertyCard.locator('[data-testid="property-price"]')).toBeVisible();
  });

  test('should display error state when API is unavailable', async ({ page }) => {
    // Intercept API calls and make them fail
    await page.route('**/api/properties*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server Error' })
      });
    });
    
    // Go to homepage
    await page.goto('/');
    
    // Wait and check for error message
    await page.waitForTimeout(3000);
    
    const errorMessage = page.locator('[data-testid="error-message"]').or(
      page.locator('text=/error|no se pudo cargar/i')
    );
    
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should display empty state when no properties found', async ({ page }) => {
    // Intercept API calls and return empty results
    await page.route('**/api/properties*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          totalCount: 0,
          page: 1,
          pageSize: 12,
          totalPages: 0
        })
      });
    });
    
    // Go to homepage
    await page.goto('/');
    
    // Wait and check for empty state message
    await page.waitForTimeout(3000);
    
    const emptyMessage = page.locator('[data-testid="empty-state"]').or(
      page.locator('text=/no se encontraron|no properties found/i')
    );
    
    await expect(emptyMessage).toBeVisible({ timeout: 10000 });
  });
});