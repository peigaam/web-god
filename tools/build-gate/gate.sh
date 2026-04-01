#!/usr/bin/env bash
# web-god Build Integrity Gate
# Usage: bash gate.sh [project-dir] [--kill-list kill-list.json] [deleted_component1 ...]
# Exit 0 = PASS, non-zero = FAIL

set -eo pipefail

PROJECT_ROOT="${1:-.}"
PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"
cd "$PROJECT_ROOT"

shift 2>/dev/null || true

# Parse flags
KILL_LIST=""
DELETED_COMPONENTS=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --kill-list) KILL_LIST="$2"; shift 2 ;;
    *) DELETED_COMPONENTS+=("$1"); shift ;;
  esac
done

FAILED=0
WARNINGS=0

echo "========================================"
echo "  web-god Build Integrity Gate"
echo "  Project: $PROJECT_ROOT"
echo "========================================"
echo ""

# Detect framework
FRAMEWORK="unknown"
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ]; then
  FRAMEWORK="nextjs"
elif [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
  FRAMEWORK="vite"
elif [ -f "remix.config.js" ]; then
  FRAMEWORK="remix"
fi
echo ">> Detected framework: $FRAMEWORK"

# Detect source directory
if [ -d "$PROJECT_ROOT/src" ]; then SRC_DIR="$PROJECT_ROOT/src"
elif [ -d "$PROJECT_ROOT/app" ]; then SRC_DIR="$PROJECT_ROOT/app"
elif [ -d "$PROJECT_ROOT/lib" ]; then SRC_DIR="$PROJECT_ROOT/lib"
else SRC_DIR="$PROJECT_ROOT"
fi
echo ">> Source directory: $SRC_DIR"
echo ""

# ── Step 1: Orphaned Import Check ──
if [ ${#DELETED_COMPONENTS[@]} -gt 0 ]; then
  echo ">> Step 1: Checking for orphaned imports of deleted components..."
  for comp in "${DELETED_COMPONENTS[@]}"; do
    BASENAME=$(basename "$comp" .tsx)
    BASENAME=$(basename "$BASENAME" .ts)
    BASENAME=$(basename "$BASENAME" .jsx)
    BASENAME=$(basename "$BASENAME" .js)
    MATCHES=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
      -E "(from\s+['\"].*${BASENAME}['\"]|import\(['\"].*${BASENAME}['\"])" \
      "$SRC_DIR" 2>/dev/null || true)
    if [ -n "$MATCHES" ]; then
      echo "  [FATAL] Orphaned import of deleted '${BASENAME}':"
      echo "$MATCHES"
      FAILED=1
    fi
  done
  if [ $FAILED -eq 0 ]; then
    echo "  ✅ No orphaned imports found."
  fi
else
  echo ">> Step 1: [SKIP] No deleted components specified."
fi
echo ""

# ── Step 2: Kill List Audit ──
echo ">> Step 2: Kill list audit..."
KILL_FOUND=0

if [ -n "$KILL_LIST" ] && [ -f "$KILL_LIST" ]; then
  # Read kill list JSON: expects { "patterns": ["pattern1", "pattern2"], "description": "..." }
  while IFS= read -r pattern; do
    HITS=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.css" --include="*.jsx" \
      "$pattern" "$SRC_DIR" 2>/dev/null | head -5 || true)
    if [ -n "$HITS" ]; then
      echo "  [WARN] Kill list pattern '$pattern' found:"
      echo "$HITS"
      KILL_FOUND=1
    fi
  done < <(node -e "const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));(d.patterns||[]).forEach(p=>console.log(p))" "$KILL_LIST" 2>/dev/null || true)
fi

# Default checks (common issues)
CONSOLE_LOGS=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.jsx" \
  "console\.log\|console\.debug" "$SRC_DIR" 2>/dev/null | grep -v "node_modules" | grep -v ".test." | head -5 || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo "  [WARN] Console.log statements found in production code:"
  echo "$CONSOLE_LOGS"
  KILL_FOUND=1
  WARNINGS=$((WARNINGS + 1))
fi

TODO_COUNT=$(grep -rn --include="*.tsx" --include="*.ts" --include="*.jsx" \
  "TODO\|FIXME\|HACK\|XXX" "$SRC_DIR" 2>/dev/null | grep -v "node_modules" | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
  echo "  [INFO] $TODO_COUNT TODO/FIXME/HACK comments found."
fi

if [ $KILL_FOUND -eq 0 ]; then
  echo "  ✅ Kill list clean."
fi
echo ""

# ── Step 3: TypeScript Check ──
echo ">> Step 3: TypeScript type check..."
if [ -f "tsconfig.json" ]; then
  npx tsc --noEmit 2>&1 || { echo "  [FATAL] TypeScript errors found."; FAILED=1; }
  if [ $FAILED -eq 0 ]; then
    echo "  ✅ TypeScript clean."
  fi
else
  echo "  [SKIP] No tsconfig.json found."
fi
echo ""

# ── Step 4: Build ──
echo ">> Step 4: Framework build..."
case $FRAMEWORK in
  nextjs)
    NEXT_TELEMETRY_DISABLED=1 npx next build 2>&1 || { echo "  [FATAL] Next.js build failed."; FAILED=1; }
    ;;
  vite)
    npx vite build 2>&1 || { echo "  [FATAL] Vite build failed."; FAILED=1; }
    ;;
  *)
    if [ -f "package.json" ]; then
      npm run build 2>&1 || { echo "  [FATAL] Build failed."; FAILED=1; }
    else
      echo "  [SKIP] No recognized build system."
    fi
    ;;
esac
if [ $FAILED -eq 0 ]; then
  echo "  ✅ Build passed."
fi
echo ""

# ── Step 5: DOM Layout Audit (if dev server running) ──
echo ">> Step 5: DOM layout audit..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDITOR="$SCRIPT_DIR/../dom-auditor/index.js"

if [ -f "$AUDITOR" ]; then
  if curl -s --max-time 2 http://localhost:3000 > /dev/null 2>&1; then
    node "$AUDITOR" http://localhost:3000 2>&1
    DOM_STATUS=$?
    if [ $DOM_STATUS -ne 0 ]; then
      echo "  [WARN] DOM audit found layout violations."
      WARNINGS=$((WARNINGS + 1))
    else
      echo "  ✅ DOM audit passed."
    fi
  else
    echo "  [SKIP] Dev server not running at localhost:3000."
  fi
else
  echo "  [SKIP] DOM auditor not found at $AUDITOR."
fi
echo ""

# ── Final Verdict ──
echo "========================================"
if [ $FAILED -ne 0 ]; then
  echo "  STATUS: FAIL"
  echo "========================================"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "  STATUS: PASS (with $WARNINGS warning(s))"
  echo "========================================"
  exit 0
else
  echo "  STATUS: PASS"
  echo "========================================"
  exit 0
fi
