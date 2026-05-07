import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('wake up');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toContainText('wake up');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('prepare breakfast');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.locator('body')).toContainText('wake up');
  await expect(page.locator('body')).toContainText('prepare breakfast');
});