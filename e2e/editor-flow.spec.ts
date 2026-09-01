import { expect, test } from "@playwright/test";

test.describe("core editor flow", () => {
  test("login, create document, edit, save, and reload", async ({ page }) => {
    const uniqueTitle = `E2E Doc ${Date.now()}`;
    const bodyText = "Formatted text saved by Playwright";

    await page.goto("/login");

    await page.getByLabel("Email").fill("alice@ajaia.test");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Continue to workspace" }).click();

    await expect(page).toHaveURL("/dashboard");
    await page.getByRole("button", { name: "New document" }).click();
    await expect(page).toHaveURL(/\/doc\/.+/);

    const editor = page.locator(".tiptap");
    await editor.click();
    await editor.pressSequentially(bodyText, { delay: 20 });

    await expect(editor).toContainText(bodyText);

    // Content auto-save debounces at 1500ms — wait for that cycle to finish.
    await page.waitForTimeout(2000);
    await expect(page.getByRole("status")).toContainText("Saved", {
      timeout: 10_000,
    });

    await page.getByLabel("Document title").fill(uniqueTitle);
    await page.waitForTimeout(1000);
    await expect(page.getByRole("status")).toContainText("Saved", {
      timeout: 10_000,
    });

    await page.reload();

    await expect(page.getByLabel("Document title")).toHaveValue(uniqueTitle);
    await expect(page.locator(".tiptap")).toContainText(bodyText, {
      timeout: 10_000,
    });
  });
});
