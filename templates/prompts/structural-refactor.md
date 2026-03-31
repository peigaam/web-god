# STRUCTURAL REFACTORING — Task Queue Prompt
# Generalized from web-god. Customize for your project.

## PROJECT VARIABLES (customize)
- **Branch:** `feature/restructure`
- **Stack:** [Your framework + tools]
- **Current structure:** [Describe current section/component layout]
- **Target structure:** [Describe desired section/component layout]

## EXECUTION PROTOCOL

### Per-Iteration Cycle (MANDATORY)
1. **Read** the relevant section from your restructure plan
2. **Plan** what you'll build. Cite specific requirements.
3. **Execute** deep structural work. Minimum 200 lines changed per iteration.
4. **Verify** — `bash tools/build-gate/gate.sh [deleted_components]`
5. **Fix** any failures until STATUS: PASS
6. **Screenshot** at 1440x900 + 375x812 for modified sections
7. **Commit** — `git add -A && git commit -m "feat(restructure): iter N — [what]"`
8. **Push** every 3rd iteration

### BANNED behaviors
- CSS-only iterations (must do structural work)
- fullPage screenshots
- Restarting dev server instead of fixing code
- Reverting without 5+ debug attempts
- Reintroducing killed elements
- Self-rating
- Declaring "done" before planned iterations complete

## CIRCUIT BREAKERS
- 3 consecutive build failures on SAME issue → STOP, log error, commit WIP
- Dev server crashes 3x → STOP
- More reverting than fixing → STOP, re-read plan, fresh approach
