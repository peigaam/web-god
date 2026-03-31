/**
 * Scrollytelling Factory — Accessibility Test Suite
 *
 * Validates WCAG 2.1 AA compliance with scrollytelling-specific extensions:
 * - axe-core scans at each scene state (not just page load)
 * - prefers-reduced-motion produces a complete, non-animated experience
 * - Keyboard navigation follows scroll order
 * - ARIA landmarks present on each scene section
 *
 * Requires: @axe-core/playwright
 */

import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { scrollytellingConfig } from "../scrollytelling.config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function scrollToPercentage(
  page: Page,
  percentage: number,
): Promise<void> {
  await page.evaluate(async (pct) => {
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const targetPx = (pct / 100) * scrollableHeight;

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetPx, { immediate: true });
    } else {
      window.scrollTo(0, targetPx);
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }, percentage);
  await page.waitForTimeout(300);
}

async function initPage(page: Page, reducedMotion: boolean): Promise<void> {
  if (reducedMotion) {
    await page.emulateMedia({ reducedMotion: "reduce" });
  }

  await page.goto(scrollytellingConfig.baseUrl);

  // Wait for Lenis init (may be suppressed in reduced motion mode)
  await page.waitForFunction(
    () =>
      document.readyState === "complete" &&
      (document.documentElement.classList.contains("lenis") ||
        document.documentElement.hasAttribute("data-lenis") ||
        // In reduced motion mode, Lenis may not initialize
        window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    { timeout: 10_000 },
  );

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

// ---------------------------------------------------------------------------
// Test: axe-core per scene state
// ---------------------------------------------------------------------------

test.describe("Accessibility — axe-core per scene state", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await initPage(page, false);
  });

  test.afterAll(async () => {
    await page.close();
  });

  for (const scene of scrollytellingConfig.scenes) {
    test(`axe-core scan at ${scene.id} (${scene.scrollStart}-${scene.scrollEnd}%)`, async () => {
      const midpoint = (scene.scrollStart + scene.scrollEnd) / 2;
      await scrollToPercentage(page, midpoint);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const criticalOrSerious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(
        criticalOrSerious,
        `${scene.id}: ${criticalOrSerious.length} critical/serious axe-core violation(s):\n` +
          criticalOrSerious
            .map(
              (v) =>
                `  - ${v.id}: ${v.description} (${v.nodes.length} instance(s))`,
            )
            .join("\n"),
      ).toHaveLength(0);
    });
  }
});

// ---------------------------------------------------------------------------
// Test: prefers-reduced-motion
// ---------------------------------------------------------------------------

test.describe("Accessibility — reduced motion", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await initPage(page, true);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("no active CSS animations or transitions in reduced motion mode", async () => {
    // Scroll through each scene and check for active animations
    for (const scene of scrollytellingConfig.scenes) {
      const midpoint = (scene.scrollStart + scene.scrollEnd) / 2;
      await scrollToPercentage(page, midpoint);

      const activeAnimations = await page.evaluate(() => {
        const violations: string[] = [];
        const elements = document.querySelectorAll("*");

        for (const el of elements) {
          const style = getComputedStyle(el);

          // Check CSS animations
          if (
            style.animationName &&
            style.animationName !== "none" &&
            style.animationDuration !== "0s"
          ) {
            violations.push(
              `${el.tagName}.${el.className}: CSS animation '${style.animationName}' active`,
            );
          }

          // Check CSS transitions (allow opacity under 200ms for graceful fades)
          if (
            style.transitionProperty &&
            style.transitionProperty !== "none" &&
            style.transitionProperty !== "opacity"
          ) {
            const duration = parseFloat(style.transitionDuration);
            if (duration > 0.2) {
              violations.push(
                `${el.tagName}.${el.className}: CSS transition on '${style.transitionProperty}' (${style.transitionDuration})`,
              );
            }
          }
        }

        return violations;
      });

      expect(
        activeAnimations,
        `${scene.id}: ${activeAnimations.length} animation(s) still active in reduced motion mode:\n` +
          activeAnimations.join("\n"),
      ).toHaveLength(0);
    }
  });

  test("no active GSAP tweens in reduced motion mode", async () => {
    for (const scene of scrollytellingConfig.scenes) {
      const midpoint = (scene.scrollStart + scene.scrollEnd) / 2;
      await scrollToPercentage(page, midpoint);

      const activeTweenCount = await page.evaluate(() => {
        const gsap = (window as any).gsap;
        if (!gsap) return 0;
        return gsap.getTweensOf("*").filter((t: any) => t.isActive()).length;
      });

      expect(
        activeTweenCount,
        `${scene.id}: ${activeTweenCount} GSAP tween(s) active in reduced motion mode`,
      ).toBe(0);
    }
  });

  test("all narrative content is visible in reduced motion mode", async () => {
    // Scroll through every scene and verify the Von Restorff target is visible
    for (const scene of scrollytellingConfig.scenes) {
      const midpoint = (scene.scrollStart + scene.scrollEnd) / 2;
      await scrollToPercentage(page, midpoint);

      if (scene.vonRestorffTarget) {
        const targetVisible = await page.evaluate((selector) => {
          const el = document.querySelector(selector);
          if (!el) return false;
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            parseFloat(style.opacity) > 0 &&
            rect.width > 0 &&
            rect.height > 0
          );
        }, scene.vonRestorffTarget);

        expect(
          targetVisible,
          `${scene.id}: Von Restorff target '${scene.vonRestorffTarget}' is not visible in reduced motion mode`,
        ).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Test: keyboard navigation
// ---------------------------------------------------------------------------

test.describe("Accessibility — keyboard navigation", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await initPage(page, false);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Tab key navigates through scenes in scroll order", async () => {
    // Collect the order of focused elements via Tab
    const focusOrder: string[] = [];
    const maxTabs = 50; // safety limit

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");

      const focusedInfo = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;

        // Find the closest scene section ancestor
        const sceneSection = el.closest("[data-scene]");
        const sceneId = sceneSection?.getAttribute("data-scene") ?? "unknown";
        const tagName = el.tagName.toLowerCase();
        const label =
          el.getAttribute("aria-label") ?? el.textContent?.slice(0, 30) ?? "";

        return `${sceneId}:${tagName}:${label}`;
      });

      if (!focusedInfo) break;
      focusOrder.push(focusedInfo);
    }

    // Verify focus progresses through scenes in order (S1, S2, S3, ...)
    const sceneIds = focusOrder.map((f) => f.split(":")[0]);
    const uniqueSceneOrder = sceneIds.filter(
      (id, i) => i === 0 || id !== sceneIds[i - 1],
    );

    // Scene order should be monotonically increasing
    const sceneNumbers = uniqueSceneOrder
      .filter((id) => id !== "unknown")
      .map((id) => parseInt(id.replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));

    for (let i = 1; i < sceneNumbers.length; i++) {
      expect(
        sceneNumbers[i],
        `Focus order violation: Scene ${sceneNumbers[i]} appears after Scene ${sceneNumbers[i - 1]} — expected monotonically increasing`,
      ).toBeGreaterThanOrEqual(sceneNumbers[i - 1]);
    }
  });

  test("all interactive elements have visible focus indicators", async () => {
    // Tab through and check each focused element has a visible focus style
    const maxTabs = 50;
    const invisibleFocusElements: string[] = [];

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");

      const result = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;

        const style = getComputedStyle(el);
        const outlineWidth = parseFloat(style.outlineWidth);
        const outlineStyle = style.outlineStyle;
        const boxShadow = style.boxShadow;

        const hasFocusIndicator =
          (outlineWidth >= 2 && outlineStyle !== "none") ||
          (boxShadow !== "none" && boxShadow !== "");

        return {
          element: `${el.tagName}.${el.className}`,
          hasFocusIndicator,
        };
      });

      if (!result) break;
      if (!result.hasFocusIndicator) {
        invisibleFocusElements.push(result.element);
      }
    }

    expect(
      invisibleFocusElements,
      `${invisibleFocusElements.length} interactive element(s) lack visible focus indicators:\n` +
        invisibleFocusElements.join("\n"),
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Test: ARIA landmarks
// ---------------------------------------------------------------------------

test.describe("Accessibility — ARIA landmarks", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await initPage(page, false);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("each scene section has an ARIA landmark with a label", async () => {
    const landmarkResults = await page.evaluate(() => {
      const sceneSections = document.querySelectorAll("[data-scene]");
      const results: Array<{
        sceneId: string;
        hasRole: boolean;
        hasLabel: boolean;
      }> = [];

      for (const section of sceneSections) {
        const sceneId = section.getAttribute("data-scene") ?? "unknown";
        const role =
          section.getAttribute("role") ?? section.tagName.toLowerCase();
        const hasRole =
          role === "region" ||
          role === "article" ||
          section.tagName === "SECTION" ||
          section.tagName === "ARTICLE";
        const hasLabel =
          !!section.getAttribute("aria-label") ||
          !!section.getAttribute("aria-labelledby");

        results.push({ sceneId, hasRole, hasLabel });
      }

      return results;
    });

    for (const result of landmarkResults) {
      expect(
        result.hasRole,
        `${result.sceneId}: missing landmark role (needs role="region" or semantic <section>/<article>)`,
      ).toBe(true);

      expect(
        result.hasLabel,
        `${result.sceneId}: landmark missing aria-label or aria-labelledby`,
      ).toBe(true);
    }
  });

  test("page has a main landmark wrapping scrollytelling content", async () => {
    const hasMain = await page.evaluate(
      () => document.querySelectorAll("main").length === 1,
    );
    expect(hasMain, "Page must have exactly one <main> landmark").toBe(true);
  });
});
