/**
 * Scrollytelling test configuration template.
 * Copy to tests/scrollytelling.config.ts and customize for your project.
 */

export const scrollytellingConfig = {
  baseUrl: 'http://localhost:3000',
  totalScrollHeight: 0, // measured after Lenis init
  scenes: [
    {
      id: 'S1-Hero',
      scrollStart: 0,
      scrollEnd: 8,
      triggers: [
        { id: 'T01', scrollPosition: 4, description: 'Hero headline reveal', isAnimated: true },
      ],
      cognitiveLoadBudget: 2,
      vonRestorffTarget: '.hero-headline',
    },
    // Add more scenes...
  ],
  viewports: [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ],
  goldenBaselineDir: 'tests/golden-baselines',
};
