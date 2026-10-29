import { expect, test, type Page } from "@playwright/test";
import { projectSlugs } from "../src/data/projects";

const KEY = "frame-motion-locale";

async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
}

test.describe("language", () => {
  test("browser language picks the locale when nothing is saved", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "pt-BR" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await ctx.close();
  });

  test("saved selection wins over browser language", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "pt-BR" });
    await ctx.addInitScript(([k]) => localStorage.setItem(k, "es"), [KEY]);
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/es\/$/);
    await ctx.close();
  });

  test("unsupported browser language falls back to English", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "de-DE" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    await ctx.close();
  });

  test("switching language keeps the current project and filters, updates lang and saves the choice", async ({ page }) => {
    await page.goto("/en/work/silver-line/");
    await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/work\/silver-line\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Silver Line");
    await expect(page.getByText("Proyecto Conceptual").first()).toBeVisible();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe("es");

    await page.goto("/pt/work/?category=sports");
    await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/work\/\?category=sports$/);
    await expect(page.getByRole("button", { name: /Sports & Performance/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("every locale renders translated navigation", async ({ page }) => {
    for (const [locale, work] of [["en", "Work"], ["pt", "Trabalhos"], ["es", "Trabajos"]] as const) {
      await page.goto(`/${locale}/`);
      await expect(page.locator("header nav").getByRole("link", { name: work })).toBeVisible();
    }
  });
});

test.describe("selected work", () => {
  test("lists all 30 projects once", async ({ page }) => {
    await page.goto("/en/work/");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(30);
    const titles = await cards.locator("h2").allTextContents();
    expect(new Set(titles).size).toBe(30);
  });

  test("category filter, search, empty state and shareable URL", async ({ page }) => {
    await page.goto("/en/work/");
    await page.getByRole("button", { name: /Portrait & Beauty/ }).click();
    await expect(page).toHaveURL(/category=portrait/);
    await expect(page.locator("main article")).toHaveCount(7);

    await page.getByRole("button", { name: /All work/ }).click();
    await page.getByLabel("Search projects").fill("jewelry");
    await expect(page.locator("main article")).toHaveCount(1);
    await expect(page.locator("main article h2")).toHaveText("Silver Line");
    await expect(page).toHaveURL(/q=jewelry/);

    await page.getByLabel("Search projects").fill("zzzz");
    await expect(page.getByText("No projects match yet.")).toBeVisible();
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.locator("main article")).toHaveCount(30);

    await page.goto("/en/work/?category=sports&q=dance");
    await expect(page.getByRole("button", { name: /Sports & Performance/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main article h2")).toHaveText(["Studio Eight"]);
  });

  test("search is accent-insensitive in Portuguese", async ({ page }) => {
    await page.goto("/pt/work/?q=composicao");
    expect(await page.locator("main article").count()).toBeGreaterThan(0);
  });
});

test.describe("case studies", () => {
  test("all 30 case-study pages exist in every language", async ({ request }) => {
    expect(projectSlugs).toHaveLength(30);
    for (const locale of ["en", "pt", "es"]) {
      for (const slug of projectSlugs) {
        const res = await request.get(`/${locale}/work/${slug}/`);
        expect(res.status(), `${locale}/${slug}`).toBe(200);
      }
    }
  });

  test("every card on the work page links to a working case study", async ({ page }) => {
    await page.goto("/en/work/");
    const hrefs = await page.locator("main article h2 a").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")));
    expect(hrefs).toHaveLength(30);
    for (const href of hrefs) {
      const res = await page.request.get(href!);
      expect(res.status(), href!).toBe(200);
      const html = await res.text();
      expect(html).toContain("Concept Project");
      expect(html).toContain("Suggested Production Stack");
    }
  });

  test("case study has required sections and prev/next navigation", async ({ page }) => {
    await page.goto("/en/work/night-shift/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Night Shift");
    for (const name of ["The brief", "Included deliverables", "Suggested Production Stack", "Motion previews", "Related projects"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(/silver-line/);
  });
});

test.describe("media", () => {
  test("no GIF or MP4 is downloaded on initial home load", async ({ page }) => {
    const heavy: string[] = [];
    page.on("request", (r) => {
      if (/\.(gif|mp4)(\?|$)/.test(r.url())) heavy.push(r.url());
    });
    await page.goto("/en/", { waitUntil: "networkidle" });
    expect(heavy).toEqual([]);
  });

  test("video plays on demand, and only one plays at a time", async ({ page }) => {
    await page.goto("/en/");
    const showcase = page.locator("#motion-title").locator("xpath=ancestor::section");
    await showcase.scrollIntoViewIfNeeded();
    await showcase.getByRole("button", { name: /^Play: / }).click();
    const first = showcase.locator("video");
    await expect.poll(() => first.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);

    // Open a second preview from the hero: the showcase video must pause.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: "Watch motion preview" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.locator("video").evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    expect(await first.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);

    // Pause control, then Escape closes and returns focus.
    await dialog.getByRole("button", { name: "Pause" }).click();
    await expect.poll(() => dialog.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Watch motion preview" }).first()).toBeFocused();
  });

  test("off-screen video pauses", async ({ page }) => {
    await page.goto("/en/work/airborne/");
    const section = page.locator("#motion-title").locator("xpath=ancestor::section");
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("button", { name: /^Play: / }).click();
    const video = section.locator("video");
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test("image viewer opens the original, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/en/work/skin-stories/");
    const trigger = page.getByRole("button", { name: "View full size: Skin Stories" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const img = dialog.locator("img");
    await expect(img).toHaveAttribute("src", "/media/33/full.jpg");
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBe(1536);
    await dialog.getByRole("button", { name: "Zoom in" }).click();
    await expect(dialog.getByRole("button", { name: "Fit to screen" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("GIF loads only after an explicit click", async ({ page }) => {
    let gifRequested = false;
    page.on("request", (r) => {
      if (r.url().endsWith("/media/42/motion.gif")) gifRequested = true;
    });
    await page.goto("/en/work/soft-spot/", { waitUntil: "networkidle" });
    expect(gifRequested).toBe(false);
    await page.getByRole("button", { name: "Load GIF preview" }).click();
    await expect(page.getByRole("img", { name: "Soft Spot — GIF loop" })).toBeVisible();
    expect(gifRequested).toBe(true);
  });

  test("missing assets show a graceful fallback", async ({ page }) => {
    await page.route(/\/media\/44\/image-.*/, (route) => route.fulfill({ status: 404, body: "" }));
    await page.route(/\/media\/44\/motion\.mp4/, (route) => route.fulfill({ status: 404, body: "" }));
    await page.goto("/en/work/good-dog-day/");
    await expect(page.getByText("Image unavailable").first()).toBeVisible();
    const section = page.locator("#motion-title").locator("xpath=ancestor::section");
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("button", { name: /^Play: / }).click();
    await expect(section.getByText("Video unavailable")).toBeVisible();
  });
});

test.describe("navigation and accessibility", () => {
  test("header height is ~96px on desktop and ~76px on mobile", async ({ page }) => {
    await page.goto("/en/");
    expect(Math.round((await page.locator("header > div").boundingBox())!.height)).toBe(96);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(Math.round((await page.locator("header > div").boundingBox())!.height)).toBe(76);
  });

  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/en/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("active nav state is announced", async ({ page }) => {
    await page.goto("/en/expertise/");
    await expect(page.locator("header nav").getByRole("link", { name: "Expertise" })).toHaveAttribute("aria-current", "page");
  });

  test("mobile menu opens, traps focus, closes with Escape and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const menu = page.getByRole("dialog", { name: "Main navigation" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await menu.getByRole("link", { name: "Process" }).click();
    await expect(page).toHaveURL(/\/en\/process\/$/);
    await expect(menu).toBeHidden();
  });

  test("buttons meet the 44px minimum target size", async ({ page }) => {
    for (const [w, path] of [[1440, "/en/work/"], [390, "/en/"], [390, "/en/work/airborne/"]] as const) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(path);
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("button, header a, [role=group] a")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return r.width > 0 && style.visibility !== "hidden" && !el.classList.contains("sr-only") && (r.width < 43.5 || r.height < 43.5);
          })
          .map((el) => `${el.tagName} ${el.getAttribute("aria-label") ?? el.textContent?.trim()} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
      );
      expect(small, `${w} ${path}`).toEqual([]);
    }
  });

  test("one h1 per page and images have alt attributes", async ({ page }) => {
    for (const path of ["/en/", "/en/work/", "/en/work/night-shift/", "/en/expertise/", "/en/process/", "/en/about/"]) {
      await page.goto(path);
      await expect(page.locator("h1"), path).toHaveCount(1);
      expect(await page.locator("img:not([alt])").count(), path).toBe(0);
      await expect(page.locator("main#main")).toHaveCount(1);
    }
  });

  test("reduced motion: hero does not auto-rotate", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/");
    const counter = page.getByText(/^01 \/ 05$/);
    await expect(counter).toBeVisible();
    await page.waitForTimeout(7500);
    await expect(counter).toBeVisible();
    await expect(page.getByRole("button", { name: "Play artwork rotation" })).toBeVisible();
    await ctx.close();
  });

  test("hero rotation can be paused", async ({ page }) => {
    await page.goto("/en/");
    await page.mouse.move(5, 890);
    const pause = page.getByRole("button", { name: "Pause artwork rotation" });
    await pause.click();
    await page.mouse.move(5, 890);
    await expect(page.getByRole("button", { name: "Play artwork rotation" })).toHaveAttribute("aria-pressed", "true");
    const before = await page.getByText(/^0\d \/ 05$/).textContent();
    await page.waitForTimeout(7500);
    expect(await page.getByText(/^0\d \/ 05$/).textContent()).toBe(before);
  });

  test("Workana hire link is shown in every language and opens in a new tab", async ({ page }) => {
    const url = "https://www.workana.com/freelancer/ced96263bb765dfc68b6aaabbad659dc";
    for (const [locale, label] of [["en", "Hire me on Workana"], ["pt", "Contrate-me no Workana"], ["es", "Contrátame en Workana"]]) {
      await page.goto(`/${locale}/about/`);
      await expect(page.locator("header").first()).toContainText("Petr Smital");
      const links = page.locator("[data-hire-link]");
      expect(await links.count()).toBeGreaterThanOrEqual(3);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("href", url);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
      await expect(page.locator("main").getByRole("link", { name: new RegExp(`^${label}`) }).first()).toBeVisible();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog").getByRole("link", { name: /^Hire me on Workana/ })).toHaveAttribute("href", url);
  });

  test("unknown routes return the 404 page", async ({ page }) => {
    const res = await page.goto("/en/work/does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("404");
  });
});

test.describe("responsive", () => {
  const paths = ["/en/", "/pt/work/", "/es/work/small-world-kitchen/", "/en/expertise/", "/pt/process/", "/es/about/"];
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        expect(await noHorizontalOverflow(page), `${width} ${path}`).toBe(true);
      }
    });
  }

  test("200% zoom (1440px window → 720px CSS viewport) has no overflow or clipped hero", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    for (const path of paths) {
      await page.goto(path);
      expect(await noHorizontalOverflow(page), path).toBe(true);
    }
    await page.goto("/en/");
    await expect(page.getByRole("link", { name: "Explore my work" }).first()).toBeVisible();
    await ctx.close();
  });

  test("hero fits within a 1440×900 viewport", async ({ page }) => {
    await page.goto("/en/");
    // Poll: the page-transition entrance briefly offsets content by a few pixels.
    await expect
      .poll(() => page.locator("#hero-title").evaluate((h) => h.closest("section")!.getBoundingClientRect().bottom))
      .toBeLessThanOrEqual(900);
  });
});
