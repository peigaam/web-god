#!/usr/bin/env bash
set -eo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="${CLAUDE_HOME:-$HOME/.claude}"
AGENTS_DIR="$CLAUDE_DIR/agents"
SKILLS_DIR="$CLAUDE_DIR/skills"

echo "╔══════════════════════════════════════════╗"
echo "║         web-god installer v0.1.0         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

mkdir -p "$AGENTS_DIR" "$SKILLS_DIR"

echo ">> Installing agents..."
AGENT_COUNT=0
for domain_dir in "$SCRIPT_DIR"/agents/*/; do
  domain=$(basename "$domain_dir")
  for agent_file in "$domain_dir"*.md; do
    [ -f "$agent_file" ] || continue
    agent_name=$(basename "$agent_file" .md)
    dest="$AGENTS_DIR/webgod-${domain}-${agent_name}.md"
    cp "$agent_file" "$dest"
    AGENT_COUNT=$((AGENT_COUNT + 1))
  done
done
echo "   ✅ Installed $AGENT_COUNT agents"

echo ">> Installing skills..."
SKILL_COUNT=0
for skill_dir in "$SCRIPT_DIR"/skills/*/; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  dest_dir="$SKILLS_DIR/webgod-${skill_name}"
  rm -rf "$dest_dir"
  cp -r "$skill_dir" "$dest_dir"
  SKILL_COUNT=$((SKILL_COUNT + 1))
done
echo "   ✅ Installed $SKILL_COUNT skills"
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Installation complete.                  ║"
echo "║  Start Claude Code — agents auto-load.   ║"
echo "╚══════════════════════════════════════════╝"
