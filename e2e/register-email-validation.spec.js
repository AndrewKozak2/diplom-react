import { test, expect } from "@playwright/test";

// Covers TICKET-142 (.claude/ticket.md): client-side email format validation
// on the registration form, added in feature/email-validation.

test.describe("Register form email validation", () => {
  test("rejects a malformed email with an inline error and does not navigate away", async ({ page }) => {
    await page.goto("/register");

    await page.getByPlaceholder("Ім’я користувача").fill("e2e_test_user");
    await page.getByPlaceholder("Електронна пошта").fill("test@test");
    await page.getByPlaceholder("Пароль", { exact: true }).fill("Password123");
    await page.getByPlaceholder("Підтвердіть пароль").fill("Password123");

    await page.getByRole("button", { name: "Зареєструватися" }).click();

    await expect(page.getByText("Введіть коректну електронну адресу")).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("clears the error as soon as a syntactically valid email is entered", async ({ page }) => {
    await page.goto("/register");

    const emailInput = page.getByPlaceholder("Електронна пошта");
    await page.getByPlaceholder("Ім’я користувача").fill("e2e_test_user");
    await emailInput.fill("test@test");
    await page.getByPlaceholder("Пароль", { exact: true }).fill("Password123");
    await page.getByPlaceholder("Підтвердіть пароль").fill("Password123");
    await page.getByRole("button", { name: "Зареєструватися" }).click();
    await expect(page.getByText("Введіть коректну електронну адресу")).toBeVisible();

    await emailInput.fill("test@example.com");
    await expect(page.getByText("Введіть коректну електронну адресу")).toHaveCount(0);
  });
});
