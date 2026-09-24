import { expect, test } from "@playwright/test";

test("la racine redirige vers l'anglais par défaut", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("thème sombre par défaut, bascule avec T", async ({ page }) => {
  await page.goto("/en", { waitUntil: "networkidle" }); // raccourcis actifs après hydratation
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.locator("body").press("t");
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("changement de langue mémorisé", async ({ page, context }) => {
  await page.goto("/en");
  await page.locator('header a[hreflang="fr"]').click();
  await expect(page).toHaveURL(/\/fr$/);
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === "locale")?.value).toBe("fr");
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
});

test("lien d'évitement vers le contenu", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
});

test("palette ⌘K : navigation vers les projets", async ({ page }) => {
  await page.goto("/en", { waitUntil: "networkidle" });
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox").fill("all proj");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects$/);
});

test("préférence « réduire les animations »", async ({ page }) => {
  await page.goto("/en", { waitUntil: "networkidle" }); // raccourcis actifs après hydratation
  const html = page.locator("html");
  // Le navigateur de test émule prefers-reduced-motion: reduce
  await expect(html).toHaveAttribute("data-motion", "reduce");
  await page.locator("body").press("m");
  await expect(html).toHaveAttribute("data-motion", "full");
  await page.reload();
  await expect(html).toHaveAttribute("data-motion", "full");
});

test("404 personnalisée et localisée", async ({ page }) => {
  const res = await page.goto("/fr/projects/nexiste-pas");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Cette page n'existe pas")).toBeVisible();
});

test("admin protégé", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("button", { name: /GitHub/ })).toBeVisible();
});

test("SEO : sitemap, robots, icône", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");
  const icon = await request.get("/icon");
  expect(icon.headers()["content-type"]).toContain("image/png");
});

test("formulaire de contact : soumission trop rapide ignorée silencieusement", async ({ page }) => {
  await page.goto("/en#contact");
  await page.getByLabel("Name").fill("Test");
  await page.getByLabel("Email", { exact: true }).first().fill("test@example.com");
  await page.getByLabel("Message").fill("Hello");
  await page.getByRole("button", { name: /Send/ }).click();
  await expect(page.getByRole("status").filter({ hasText: /Message sent/ })).toBeVisible();
});
