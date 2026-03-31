#!/usr/bin/env node
const { execFileSync } = require("child_process");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const command = args[0];

const COMMANDS = {
  audit: {
    desc: "Run DOM spatial audit",
    run: () =>
      execFileSync(
        "node",
        [
          `${ROOT}/tools/dom-auditor/index.js`,
          args[1] || "http://localhost:3000",
          ...args.slice(2),
        ],
        { stdio: "inherit" },
      ),
  },
  gate: {
    desc: "Run build integrity gate",
    run: () =>
      execFileSync(
        "bash",
        [`${ROOT}/tools/build-gate/gate.sh`, args[1] || ".", ...args.slice(2)],
        { stdio: "inherit" },
      ),
  },
  install: {
    desc: "Install agents and skills into Claude Code",
    run: () =>
      execFileSync("bash", [`${ROOT}/install.sh`], { stdio: "inherit" }),
  },
  security: {
    desc: "Security audit (use via Claude Code agent)",
    run: () => {
      console.log(
        "Security scanning runs via the security-threat-modeler agent in Claude Code.",
      );
      console.log("");
      console.log(
        'Invoke: "Use the security agent to perform a STRIDE threat model on this project"',
      );
      console.log("");
      console.log("For dependency scanning: npm audit");
      process.exit(0);
    },
  },
  perf: {
    desc: "Performance audit (use via Claude Code agent)",
    run: () => {
      console.log(
        "Performance profiling runs via the performance-profiler agent in Claude Code.",
      );
      console.log("");
      console.log(
        'Invoke: "Audit the performance of this Next.js app and produce an optimization plan"',
      );
      console.log("");
      console.log(
        "For Lighthouse: npx lighthouse http://localhost:3000 --output json",
      );
      process.exit(0);
    },
  },
  seo: {
    desc: "SEO audit (use via Claude Code agent)",
    run: () => {
      console.log(
        "SEO auditing runs via the seo-auditor agent in Claude Code.",
      );
      console.log("");
      console.log(
        'Invoke: "Audit the SEO of this site and produce a fix list"',
      );
      process.exit(0);
    },
  },
};

if (!command || command === "--help") {
  console.log(
    "\n  web-god — Web development intelligence layer\n\n  Commands:",
  );
  Object.entries(COMMANDS).forEach(([k, v]) =>
    console.log(`    ${k.padEnd(12)} ${v.desc}`),
  );
  console.log("");
  process.exit(0);
}
if (!COMMANDS[command]) {
  console.error(
    `Unknown command: ${command}. Run web-god --help for available commands.`,
  );
  process.exit(1);
}
try {
  COMMANDS[command].run();
} catch (e) {
  process.exit(e.status || 1);
}
