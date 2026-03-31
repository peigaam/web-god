#!/usr/bin/env node
// DOM Layout Auditor — deterministic spatial checks via Playwright
// Usage: node scripts/dom-auditor.js [url] [--strict]
// Requires: npx playwright install chromium

const { chromium } = require("playwright");

const url =
  process.argv[2] && process.argv[2].startsWith("http")
    ? process.argv[2]
    : "http://localhost:3000";
const strict = process.argv.includes("--strict");

const VIEWPORTS = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 },
];

const SKIP_TAGS = new Set([
  "html",
  "head",
  "body",
  "script",
  "style",
  "meta",
  "link",
  "br",
  "hr",
  "noscript",
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "g",
  "defs",
  "clipPath",
]);
const SKIP_CLASSES = ["gsap", "lenis", "__next", "scroll"];

(async () => {
  let totalErrors = 0;
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    } catch (e) {
      console.error(`FAIL: Cannot reach ${url} — is dev server running?`);
      process.exit(1);
    }

    await page.waitForTimeout(2000);

    const issues = await page.evaluate(
      ({ vpWidth, skipTags, skipClasses, isStrict }) => {
        const errors = [];
        const seen = new Set();

        function shouldSkip(el) {
          const tag = el.tagName.toLowerCase();
          if (skipTags.includes(tag)) return true;
          const cls = el.className?.toString?.() || "";
          if (skipClasses.some((s) => cls.includes(s))) return true;
          return false;
        }

        function elId(el) {
          const tag = el.tagName.toLowerCase();
          const cls = (el.className?.toString?.() || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .join(".");
          const id = el.id ? `#${el.id}` : "";
          return `<${tag}${id}${cls ? "." + cls : ""}>`;
        }

        // CHECK 1: Horizontal Overflow
        document.querySelectorAll("*").forEach((el) => {
          if (shouldSkip(el)) return;
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0) return;
          if (rect.right > vpWidth + 1) {
            const id = `overflow:${elId(el)}`;
            if (!seen.has(id)) {
              seen.add(id);
              errors.push({
                type: "OVERFLOW",
                el: elId(el),
                detail: `Right edge at ${Math.round(rect.right)}px, viewport is ${vpWidth}px (${Math.round(rect.right - vpWidth)}px overflow)`,
              });
            }
          }
        });

        // CHECK 2: Text too small on mobile
        if (vpWidth <= 375) {
          document
            .querySelectorAll("p, span, li, a, td, th, label, div")
            .forEach((el) => {
              if (shouldSkip(el)) return;
              if (!el.textContent?.trim()) return;
              if (el.children.length > 2) return;
              const style = window.getComputedStyle(el);
              const fontSize = parseFloat(style.fontSize);
              if (fontSize > 0 && fontSize < 14) {
                const id = `smalltext:${elId(el)}:${fontSize}`;
                if (!seen.has(id)) {
                  seen.add(id);
                  const text = el.textContent.trim().slice(0, 40);
                  errors.push({
                    type: "SMALL_TEXT",
                    el: elId(el),
                    detail: `Font size ${fontSize}px (min 14px on mobile). Text: "${text}..."`,
                  });
                }
              }
            });
        }

        // CHECK 3: Touch target too small on mobile
        if (vpWidth <= 375) {
          document
            .querySelectorAll(
              'a, button, [role="button"], input, select, textarea',
            )
            .forEach((el) => {
              if (shouldSkip(el)) return;
              const rect = el.getBoundingClientRect();
              if (rect.width <= 0 || rect.height <= 0) return;
              if (rect.width < 44 || rect.height < 44) {
                const id = `touch:${elId(el)}`;
                if (!seen.has(id)) {
                  seen.add(id);
                  errors.push({
                    type: "TOUCH_TARGET",
                    el: elId(el),
                    detail: `${Math.round(rect.width)}x${Math.round(rect.height)}px (min 44x44px)`,
                  });
                }
              }
            });
        }

        // CHECK 4: Contrast ratio on text
        document
          .querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, a, li, td, label")
          .forEach((el) => {
            if (shouldSkip(el)) return;
            if (!el.textContent?.trim()) return;
            if (el.children.length > 2) return;
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bg = style.backgroundColor;
            const parseRGB = (str) => {
              const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
              return m ? [+m[1], +m[2], +m[3]] : null;
            };
            const fg = parseRGB(color);
            const bgc = parseRGB(bg);
            if (
              !fg ||
              !bgc ||
              (bgc[0] === 0 &&
                bgc[1] === 0 &&
                bgc[2] === 0 &&
                bg.includes("0)"))
            )
              return;
            const lum = ([r, g, b]) => {
              const [rs, gs, bs] = [r, g, b].map((c) => {
                c = c / 255;
                return c <= 0.03928
                  ? c / 12.92
                  : Math.pow((c + 0.055) / 1.055, 2.4);
              });
              return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };
            const l1 = lum(fg),
              l2 = lum(bgc);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            if (ratio < 4.5) {
              const id = `contrast:${elId(el)}`;
              if (!seen.has(id)) {
                seen.add(id);
                const text = el.textContent.trim().slice(0, 30);
                errors.push({
                  type: "LOW_CONTRAST",
                  el: elId(el),
                  detail: `Ratio ${ratio.toFixed(1)}:1 (need 4.5:1). Color: ${color} on ${bg}. Text: "${text}"`,
                });
              }
            }
          });

        // CHECK 5 (strict): Content touching viewport edge
        if (isStrict && vpWidth <= 375) {
          document.querySelectorAll("section > *, main > *").forEach((el) => {
            if (shouldSkip(el)) return;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0) return;
            if (rect.left < 8 && rect.width < vpWidth) {
              const id = `edge:${elId(el)}`;
              if (!seen.has(id)) {
                seen.add(id);
                errors.push({
                  type: "EDGE_TOUCH",
                  el: elId(el),
                  detail: `Left edge at ${Math.round(rect.left)}px (needs min 16px padding from viewport edge)`,
                });
              }
            }
          });
        }

        return errors.slice(0, 25);
      },
      {
        vpWidth: vp.width,
        skipTags: [...SKIP_TAGS],
        skipClasses: SKIP_CLASSES,
        isStrict: strict,
      },
    );

    if (issues.length > 0) {
      console.error(
        `\n❌ [${vp.name} ${vp.width}x${vp.height}] — ${issues.length} issues:`,
      );
      issues.forEach((i) => {
        console.error(`  [${i.type}] ${i.el}`);
        console.error(`    → ${i.detail}`);
      });
      totalErrors += issues.length;
    } else {
      console.log(`✅ [${vp.name} ${vp.width}x${vp.height}] — Clean`);
    }
    await page.close();
  }

  await browser.close();
  console.log(`\n${"=".repeat(50)}`);
  if (totalErrors > 0) {
    console.error(
      `STATUS: FAIL — ${totalErrors} layout violations across ${VIEWPORTS.length} viewports`,
    );
    process.exit(1);
  } else {
    console.log(`STATUS: PASS — All viewports clean`);
    process.exit(0);
  }
})();
