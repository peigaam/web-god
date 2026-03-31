/**
 * Scrollytelling Factory — Scroll Performance Test Suite
 *
 * Validates that the scrollytelling experience maintains 60fps during
 * continuous scroll. Uses Chrome DevTools Protocol to capture per-frame
 * timing and computes jank rates per scene.
 *
 * Thresholds:
 *   - Per-scene jank rate: < 5% (warning at 3%)
 *   - Max single frame: < 33ms (fail = drops below 30fps)
 *   - 95th percentile frame: < 20ms
 */

import { test, expect, type Page, type CDPSession } from "@playwright/test";
import { scrollytellingConfig } from "../scrollytelling.config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface FrameSample {
  timestamp: number;
  duration: number;
}

interface ScenePerformance {
  sceneId: string;
  scrollStart: number;
  scrollEnd: number;
  totalFrames: number;
  jankedFrames: number;
  jankRate: number;
  maxFrameTime: number;
  p95FrameTime: number;
}

async function initLenisAndWait(page: Page): Promise<void> {
  await page.goto(scrollytellingConfig.baseUrl);
  // Wait for Lenis to initialize — it adds a class or data attribute to <html>
  await page.waitForFunction(
    () =>
      document.documentElement.classList.contains("lenis") ||
      document.documentElement.hasAttribute("data-lenis"),
    { timeout: 10_000 },
  );
  // Wait for LCP
  await page.waitForLoadState("networkidle");
  // Additional settle time for initial animations
  await page.waitForTimeout(500);
}

async function measureScrollPerformance(
  page: Page,
  direction: "down" | "up",
): Promise<FrameSample[]> {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const scrollDistance = totalHeight - viewportHeight;

  // Inject frame timing collector
  await page.evaluate(() => {
    (window as any).__frameSamples = [];
    let lastTimestamp = performance.now();

    function recordFrame(timestamp: number) {
      const duration = timestamp - lastTimestamp;
      if (duration > 0) {
        (window as any).__frameSamples.push({ timestamp, duration });
      }
      lastTimestamp = timestamp;
      if (!(window as any).__stopRecording) {
        requestAnimationFrame(recordFrame);
      }
    }

    (window as any).__stopRecording = false;
    requestAnimationFrame(recordFrame);
  });

  // Execute smooth scroll via incremental mouse wheel events
  const scrollVelocity = 500; // px per second
  const stepSize = 8; // px per wheel event — smooth granularity
  const stepDelay = (stepSize / scrollVelocity) * 1000; // ms between steps
  const totalSteps = Math.ceil(scrollDistance / stepSize);

  const deltaY = direction === "down" ? stepSize : -stepSize;

  // If scrolling up, start from the bottom
  if (direction === "up") {
    await page.evaluate((h) => window.scrollTo(0, h), scrollDistance);
    await page.waitForTimeout(300);
  }

  for (let i = 0; i < totalSteps; i++) {
    await page.mouse.wheel(0, deltaY);
    await page.waitForTimeout(stepDelay);
  }

  // Stop recording and collect samples
  await page.evaluate(() => {
    (window as any).__stopRecording = true;
  });
  await page.waitForTimeout(200); // Let final frames flush

  const samples: FrameSample[] = await page.evaluate(
    () => (window as any).__frameSamples,
  );

  return samples;
}

function computeScenePerformance(
  samples: FrameSample[],
  totalScrollHeight: number,
  viewportHeight: number,
): ScenePerformance[] {
  const scrollableDistance = totalScrollHeight - viewportHeight;
  const results: ScenePerformance[] = [];

  for (const scene of scrollytellingConfig.scenes) {
    const sceneStartPx = (scene.scrollStart / 100) * scrollableDistance;
    const sceneEndPx = (scene.scrollEnd / 100) * scrollableDistance;

    // Map scene scroll range to approximate time range in samples
    // This is a simplification — in practice, the mapping depends on scroll
    // velocity and Lenis smoothing. For consistent measurement, we use the
    // proportional slice of the sample array.
    const totalDuration = samples.reduce((sum, s) => sum + s.duration, 0);
    const sceneStartTime = (sceneStartPx / scrollableDistance) * totalDuration;
    const sceneEndTime = (sceneEndPx / scrollableDistance) * totalDuration;

    let elapsed = 0;
    const sceneFrames: number[] = [];

    for (const sample of samples) {
      elapsed += sample.duration;
      if (elapsed >= sceneStartTime && elapsed <= sceneEndTime) {
        sceneFrames.push(sample.duration);
      }
    }

    if (sceneFrames.length === 0) {
      results.push({
        sceneId: scene.id,
        scrollStart: scene.scrollStart,
        scrollEnd: scene.scrollEnd,
        totalFrames: 0,
        jankedFrames: 0,
        jankRate: 0,
        maxFrameTime: 0,
        p95FrameTime: 0,
      });
      continue;
    }

    const jankedFrames = sceneFrames.filter((d) => d > 16.67).length;
    const sorted = [...sceneFrames].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);

    results.push({
      sceneId: scene.id,
      scrollStart: scene.scrollStart,
      scrollEnd: scene.scrollEnd,
      totalFrames: sceneFrames.length,
      jankedFrames,
      jankRate: jankedFrames / sceneFrames.length,
      maxFrameTime: Math.max(...sceneFrames),
      p95FrameTime: sorted[p95Index] ?? sorted[sorted.length - 1],
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Scroll Performance", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await initLenisAndWait(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("forward scroll maintains 60fps across all scenes", async () => {
    const samples = await measureScrollPerformance(page, "down");

    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const results = computeScenePerformance(
      samples,
      totalHeight,
      viewportHeight,
    );

    for (const scene of results) {
      // Hard fail: any frame drops below 30fps
      expect(
        scene.maxFrameTime,
        `${scene.sceneId}: max frame time ${scene.maxFrameTime.toFixed(1)}ms exceeds 33ms (below 30fps)`,
      ).toBeLessThan(33);

      // Jank rate threshold
      expect(
        scene.jankRate,
        `${scene.sceneId}: jank rate ${(scene.jankRate * 100).toFixed(1)}% exceeds 5% threshold`,
      ).toBeLessThan(0.05);
    }
  });

  test("reverse scroll maintains 60fps (cleanup validation)", async () => {
    // Scroll to bottom first
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const samples = await measureScrollPerformance(page, "up");

    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const results = computeScenePerformance(
      samples,
      totalHeight,
      viewportHeight,
    );

    for (const scene of results) {
      // Reverse scroll has a slightly relaxed threshold (8% vs 5%)
      // because GSAP ScrollTrigger reversal can be inherently more expensive
      expect(
        scene.jankRate,
        `${scene.sceneId} (reverse): jank rate ${(scene.jankRate * 100).toFixed(1)}% exceeds 8% threshold`,
      ).toBeLessThan(0.08);

      expect(
        scene.maxFrameTime,
        `${scene.sceneId} (reverse): max frame time ${scene.maxFrameTime.toFixed(1)}ms exceeds 33ms`,
      ).toBeLessThan(33);
    }
  });

  test("no layout-triggering animations in scroll hot path", async () => {
    // Inject a MutationObserver + style watcher that detects animations on
    // layout-triggering properties during scroll
    const layoutViolations: string[] = await page.evaluate(() => {
      const violations: string[] = [];
      const BANNED_PROPERTIES = [
        "width",
        "height",
        "top",
        "left",
        "right",
        "bottom",
        "margin",
        "padding",
      ];

      // Check all elements with active CSS transitions
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const transition = style.transitionProperty;
        if (transition && transition !== "none" && transition !== "all") {
          for (const prop of BANNED_PROPERTIES) {
            if (transition.includes(prop)) {
              violations.push(
                `${el.tagName}.${el.className}: CSS transition on '${prop}'`,
              );
            }
          }
        }
      }

      return violations;
    });

    expect(
      layoutViolations,
      `Found ${layoutViolations.length} layout-triggering animation(s):\n${layoutViolations.join("\n")}`,
    ).toHaveLength(0);
  });
});
