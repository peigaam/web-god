/**
 * Scrollytelling Factory — Visual Regression Test Suite
 *
 * Captures screenshots at every scroll trigger point across 3 viewports
 * and compares against golden baselines using Playwright's built-in
 * snapshot comparison.
 *
 * Thresholds:
 *   - Static trigger: maxDiffPixelRatio 0.05 (SSIM ~0.95)
 *   - Animated trigger: maxDiffPixelRatio 0.10 (SSIM ~0.90)
 *
 * Run with --update-snapshots to regenerate golden baselines after
 * human-approved storyboard changes.
 */

import { test, expect, type Page } from "@playwright/test";
import { scrollytellingConfig } from "../scrollytelling.config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VIEWPORTS = scrollytellingConfig.viewports ?? [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const ANIMATION_SETTLE_MS = 300;

async function scrollToPercentage(
  page: Page,
  percentage: number,
): Promise<void> {
  await page.evaluate(async (pct) => {
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const targetPx = (pct / 100) * scrollableHeight;

    // Use Lenis if available for consistent scroll behavior
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(targetPx, { immediate: true });
    } else {
      window.scrollTo(0, targetPx);
    }

    // Wait for scroll to apply
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }, percentage);
}

async function waitForAnimationSettle(page: Page): Promise<void> {
  // Wait for GSAP tweens to complete at this scroll position
  await page.evaluate(async () => {
    const startTime = performance.now();
    const maxWait = 2000;

    while (performance.now() - startTime < maxWait) {
      const gsap = (window as any).gsap;
      if (gsap) {
        const activeTweens = gsap
          .getTweensOf("*")
          .filter((t: any) => t.isActive());
        if (activeTweens.length === 0) break;
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });

  // Additional static settle time for CSS transitions
  await page.waitForTimeout(ANIMATION_SETTLE_MS);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

for (const viewport of VIEWPORTS) {
  test.describe(`Visual Regression — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto(scrollytellingConfig.baseUrl);

      // Wait for Lenis initialization
      await page.waitForFunction(
        () =>
          document.documentElement.classList.contains("lenis") ||
          document.documentElement.hasAttribute("data-lenis"),
        { timeout: 10_000 },
      );
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
    });

    test.afterAll(async () => {
      await page.close();
    });

    for (const scene of scrollytellingConfig.scenes) {
      for (const trigger of scene.triggers) {
        test(`${trigger.id} — ${trigger.description} at ${trigger.scrollPosition}%`, async () => {
          await scrollToPercentage(page, trigger.scrollPosition);
          await waitForAnimationSettle(page);

          const screenshot = await page.screenshot({ fullPage: false });

          // Use relaxed threshold for animated triggers
          const maxDiffPixelRatio = trigger.isAnimated ? 0.1 : 0.05;

          expect(screenshot).toMatchSnapshot(
            `${viewport.name}/${trigger.id}.png`,
            { maxDiffPixelRatio },
          );
        });
      }
    }

    test("no cumulative layout shift during scroll", async () => {
      // Measure CLS during a full scroll-through
      const clsScore = await page.evaluate(async () => {
        let cumulativeScore = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cumulativeScore += (entry as any).value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });

        // Scroll through the entire page in steps
        const totalHeight = document.body.scrollHeight;
        const step = window.innerHeight / 2;
        for (let pos = 0; pos < totalHeight; pos += step) {
          window.scrollTo(0, pos);
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }

        // Disconnect and return
        observer.disconnect();
        return cumulativeScore;
      });

      expect(
        clsScore,
        `CLS score ${clsScore.toFixed(3)} exceeds 0.1 threshold`,
      ).toBeLessThan(0.1);
    });
  });
}
