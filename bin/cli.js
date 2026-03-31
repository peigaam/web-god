#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0];

const COMMANDS = {
  audit: { desc: 'Run DOM spatial audit', run: () => execSync(`node ${ROOT}/tools/dom-auditor/index.js ${args[1] || 'http://localhost:3000'} ${args.slice(2).join(' ')}`, { stdio: 'inherit' }) },
  gate: { desc: 'Run build integrity gate', run: () => execSync(`bash ${ROOT}/tools/build-gate/gate.sh ${args[1] || '.'} ${args.slice(2).join(' ')}`, { stdio: 'inherit' }) },
  install: { desc: 'Install agents and skills into Claude Code', run: () => execSync(`bash ${ROOT}/install.sh`, { stdio: 'inherit' }) },
};

if (!command || command === '--help') {
  console.log('\n  web-god — Web development intelligence layer\n\n  Commands:');
  Object.entries(COMMANDS).forEach(([k, v]) => console.log(`    ${k.padEnd(12)} ${v.desc}`));
  console.log('');
  process.exit(0);
}
if (!COMMANDS[command]) { console.error(`Unknown: ${command}`); process.exit(1); }
try { COMMANDS[command].run(); } catch (e) { process.exit(e.status || 1); }
