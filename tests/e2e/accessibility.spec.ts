import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const severeViolations = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );

  expect(severeViolations).toEqual([]);
});
