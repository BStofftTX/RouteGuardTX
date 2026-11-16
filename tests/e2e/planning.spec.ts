import { expect, test } from "@playwright/test";

test("offline planning is labeled as synthetic and keeps constraints out of map links", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Compare route candidates" }).click();

  await expect(page.getByText("Offline prototype")).toBeVisible();
  await expect(page.getByText("Restriction-aware candidate")).toBeVisible();
  await expect(
    page.getByText(
      "Demo data cannot verify bridge, clearance, or legal truck restrictions.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Opening a consumer map transfers only the supported origin, destination, and travel mode. RouteGuardTX safety constraints are not transferred.",
    ),
  ).toBeVisible();

  const googleLink = page.getByRole("link", {
    name: "Open destination in Google Maps",
  });
  await expect(googleLink).toHaveAttribute("href", /origin=Junction%2C\+TX/);
  await expect(googleLink).not.toHaveAttribute("href", /height|weight|length/);
});
