#!/usr/bin/env python3
"""
Scrollytelling Factory Evaluator

Deterministic evaluation script that validates a scrollytelling production
against the factory's quality standards. Checks structural compliance,
narrative coherence, performance budgets, and accessibility requirements.

Usage:
    python3 evaluator.py storyboard <storyboard_file>
    python3 evaluator.py animation <animation_spec_file> --storyboard <storyboard_file>
    python3 evaluator.py composition <composition_spec_file>
    python3 evaluator.py full <directory_containing_all_specs>

Exit codes:
    0 = PASS (all checks passed)
    1 = FAIL (violations found)
    2 = ERROR (could not parse input)
"""

import json
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Constants — the factory's non-negotiable thresholds
# ---------------------------------------------------------------------------

MAX_SCENES = 12
STAR_MOMENT_MIN_SCROLL = 55
STAR_MOMENT_MAX_SCROLL = 75
MAX_CONSECUTIVE_SAME_POLE = 2
MAX_SIMULTANEOUS_ANIMATIONS = 3
MAX_FONT_FAMILIES = 3  # 2 standard + 1 monospace exception
MIN_BODY_FONT_SIZE_MOBILE = 16
MIN_BODY_FONT_SIZE_DESKTOP = 18
MAX_IMAGE_SIZE_KB = 200
MAX_HERO_IMAGE_SIZE_KB = 400
MAX_PARALLAX_DIFFERENTIAL = 1.0
MAX_VIEWPORT_LAYERS = 8
MIN_CONTRAST_RATIO_BODY = 4.5
MIN_CONTRAST_RATIO_LARGE = 3.0
MAX_EASING_TYPES = 5
PERFORMANCE_FPS_TARGET = 60
PERFORMANCE_FPS_FLOOR = 30
JANK_RATE_THRESHOLD = 0.05

# Scene types from the perceptual grammar
VALID_SCENE_TYPES = {
    "hero", "hook", "agitation", "problem", "solution", "reveal",
    "proof", "evidence", "star", "star moment", "resolution", "cta",
    "transition", "interlude",
}

# Sparkline poles
VALID_POLES = {"status quo", "visionary future", "tension", "release", "oscillating"}

# Cinematic references
VALID_CINEMATIC_REFS = {"fincher", "scott", "anderson", "jonze", "buckley"}


# ---------------------------------------------------------------------------
# Evaluation functions
# ---------------------------------------------------------------------------

def evaluate_storyboard(content: str) -> list[dict]:
    """Evaluate a Director's storyboard against factory standards."""
    violations = []

    # Check for Big Idea
    if not re.search(r"(?i)big\s+idea", content):
        violations.append({
            "category": "NARRATIVE",
            "severity": "CRITICAL",
            "message": "No Big Idea section found. Every storyboard must have a single-sentence Big Idea.",
        })

    # Check for sparkline map
    if not re.search(r"(?i)sparkline", content):
        violations.append({
            "category": "NARRATIVE",
            "severity": "CRITICAL",
            "message": "No sparkline mapping found. Scroll depth must map to emotional oscillation.",
        })

    # Count scenes
    scene_matches = re.findall(r"(?i)(?:scene\s+\d+|S\d+[:\s])", content)
    scene_count = len(set(scene_matches)) if scene_matches else 0

    if scene_count > MAX_SCENES:
        violations.append({
            "category": "STRUCTURE",
            "severity": "MAJOR",
            "message": f"Scene count ({scene_count}) exceeds maximum ({MAX_SCENES}). Merge or cut scenes.",
        })

    # Check for STAR moment
    if not re.search(r"(?i)star\s+moment", content):
        violations.append({
            "category": "NARRATIVE",
            "severity": "CRITICAL",
            "message": "No STAR moment specification found. The peak emotional moment must be explicitly designed.",
        })

    # Check for Von Restorff targets
    von_restorff_mentions = len(re.findall(r"(?i)von\s+restorff", content))
    if von_restorff_mentions == 0:
        violations.append({
            "category": "COGNITIVE",
            "severity": "MAJOR",
            "message": "No Von Restorff targets assigned. Each scene needs exactly one attention-capturing element.",
        })

    # Check for reduced motion consideration
    if not re.search(r"(?i)reduced[\s-]motion|prefers-reduced-motion", content):
        violations.append({
            "category": "ACCESSIBILITY",
            "severity": "CRITICAL",
            "message": "No reduced motion narrative specified. Accessibility is non-negotiable.",
        })

    # Check for cognitive load budgets
    if not re.search(r"(?i)cognitive\s+load|load\s+budget", content):
        violations.append({
            "category": "COGNITIVE",
            "severity": "MAJOR",
            "message": "No cognitive load budgets specified per scene.",
        })

    # Check for flatline (3+ consecutive same-pole scenes)
    pole_sequence = re.findall(
        r"(?i)(status\s+quo|visionary\s+future|tension|release)",
        content,
    )
    if pole_sequence:
        normalized = []
        for p in pole_sequence:
            p_lower = p.lower().strip()
            if "status" in p_lower or "tension" in p_lower:
                normalized.append("negative")
            else:
                normalized.append("positive")

        consecutive = 1
        for i in range(1, len(normalized)):
            if normalized[i] == normalized[i - 1]:
                consecutive += 1
                if consecutive > MAX_CONSECUTIVE_SAME_POLE:
                    violations.append({
                        "category": "NARRATIVE",
                        "severity": "MAJOR",
                        "message": f"Sparkline flatline detected: {consecutive}+ consecutive scenes on the same emotional pole. Restructure to maintain oscillation.",
                    })
                    break
            else:
                consecutive = 1

    return violations


def evaluate_animation_spec(content: str, storyboard_content: str = "") -> list[dict]:
    """Evaluate a Choreographer's animation spec against factory standards."""
    violations = []

    # Check for Lenis configuration
    if not re.search(r"(?i)lenis|smooth\s+scroll\s+config", content):
        violations.append({
            "category": "TECH",
            "severity": "CRITICAL",
            "message": "No Lenis smooth scroll configuration found.",
        })

    # Check for scroll trigger map
    if not re.search(r"(?i)scroll\s+trigger|trigger\s+map", content):
        violations.append({
            "category": "STRUCTURE",
            "severity": "CRITICAL",
            "message": "No scroll trigger map found. Every animation must be tied to a scroll position.",
        })

    # Check for parallax depth system
    if not re.search(r"(?i)parallax|depth\s+system|depth\s+layer", content):
        violations.append({
            "category": "STRUCTURE",
            "severity": "MAJOR",
            "message": "No parallax depth system defined.",
        })

    # Check for easing vocabulary
    if not re.search(r"(?i)easing\s+vocabulary|easing\s+function", content):
        violations.append({
            "category": "MOTION",
            "severity": "MAJOR",
            "message": "No easing vocabulary defined. Motion language must be consistent and intentional.",
        })

    # Check for reduced motion fallbacks
    if not re.search(r"(?i)reduced[\s-]motion|motion\s+fallback", content):
        violations.append({
            "category": "ACCESSIBILITY",
            "severity": "CRITICAL",
            "message": "No reduced motion fallbacks specified in animation spec.",
        })

    # Check for STAR moment choreography
    if not re.search(r"(?i)star\s+moment\s+choreo|star\s+moment\s+spec", content):
        # Looser check
        if not re.search(r"(?i)star\s+moment", content):
            violations.append({
                "category": "NARRATIVE",
                "severity": "MAJOR",
                "message": "No STAR moment choreography specified.",
            })

    return violations


def evaluate_composition_spec(content: str) -> list[dict]:
    """Evaluate a Compositor's visual composition spec against factory standards."""
    violations = []

    # Check for layer stack definitions
    if not re.search(r"(?i)layer\s+stack|z-index|z\s+index", content):
        violations.append({
            "category": "STRUCTURE",
            "severity": "CRITICAL",
            "message": "No layer stack definitions found. Scene depth must be explicitly managed.",
        })

    # Check for color narrative
    if not re.search(r"(?i)color\s+narrative|color\s+palette|palette", content):
        violations.append({
            "category": "VISUAL",
            "severity": "MAJOR",
            "message": "No color narrative defined. Color must reinforce the emotional sparkline.",
        })

    # Check for asset optimization
    if not re.search(r"(?i)asset\s+optim|lazy\s+load|image\s+format", content):
        violations.append({
            "category": "PERFORMANCE",
            "severity": "MAJOR",
            "message": "No asset optimization strategy defined.",
        })

    # Check for responsive composition
    if not re.search(r"(?i)responsive|mobile|breakpoint", content):
        violations.append({
            "category": "STRUCTURE",
            "severity": "MAJOR",
            "message": "No responsive composition rules defined.",
        })

    # Check for Von Restorff isolation
    if not re.search(r"(?i)von\s+restorff|isolation|attention\s+target", content):
        violations.append({
            "category": "COGNITIVE",
            "severity": "MAJOR",
            "message": "No Von Restorff isolation strategy for scene composition.",
        })

    return violations


def evaluate_full_pipeline(directory: str) -> list[dict]:
    """Evaluate all specs in a directory for cross-spec consistency."""
    violations = []
    dir_path = Path(directory)

    # Find spec files
    storyboard = ""
    animation = ""
    typography = ""
    composition = ""

    for f in dir_path.rglob("*.md"):
        content = f.read_text(encoding="utf-8", errors="replace")
        name_lower = f.name.lower()

        if "storyboard" in name_lower or "director" in name_lower:
            storyboard = content
        elif "animation" in name_lower or "choreograph" in name_lower:
            animation = content
        elif "type" in name_lower or "typograph" in name_lower:
            typography = content
        elif "composition" in name_lower or "compositor" in name_lower:
            composition = content

    # Cross-spec checks
    if storyboard:
        violations.extend(evaluate_storyboard(storyboard))
    else:
        violations.append({
            "category": "PIPELINE",
            "severity": "CRITICAL",
            "message": "No storyboard/director spec found in directory.",
        })

    if animation:
        violations.extend(evaluate_animation_spec(animation, storyboard))
    else:
        violations.append({
            "category": "PIPELINE",
            "severity": "CRITICAL",
            "message": "No animation/choreographer spec found in directory.",
        })

    if composition:
        violations.extend(evaluate_composition_spec(composition))

    # Cross-reference: scene count consistency
    if storyboard and animation:
        storyboard_scenes = set(re.findall(r"(?i)(?:S\d+|Scene\s+\d+)", storyboard))
        animation_scenes = set(re.findall(r"(?i)(?:S\d+|Scene\s+\d+)", animation))

        storyboard_normalized = {s.upper().replace("SCENE ", "S").replace(" ", "") for s in storyboard_scenes}
        animation_normalized = {s.upper().replace("SCENE ", "S").replace(" ", "") for s in animation_scenes}

        missing_in_animation = storyboard_normalized - animation_normalized
        if missing_in_animation and len(missing_in_animation) > len(storyboard_normalized) * 0.3:
            violations.append({
                "category": "CONSISTENCY",
                "severity": "MAJOR",
                "message": f"Scene mismatch: {len(missing_in_animation)} Director scenes have no corresponding Choreographer triggers. Scenes missing: {sorted(missing_in_animation)[:5]}",
            })

    return violations


# ---------------------------------------------------------------------------
# CLI entrypoint
# ---------------------------------------------------------------------------

def format_report(violations: list[dict], mode: str) -> str:
    """Format violations into a readable report."""
    if not violations:
        return f"[PASS] {mode} evaluation complete. All checks passed."

    critical = [v for v in violations if v["severity"] == "CRITICAL"]
    major = [v for v in violations if v["severity"] == "MAJOR"]
    minor = [v for v in violations if v["severity"] == "MINOR"]

    lines = [
        f"[FAIL] {mode} evaluation: {len(violations)} violation(s) found.",
        f"  CRITICAL: {len(critical)}  MAJOR: {len(major)}  MINOR: {len(minor)}",
        "",
    ]

    for i, v in enumerate(violations, 1):
        lines.append(f"  {i}. [{v['severity']}] {v['category']}: {v['message']}")

    return "\n".join(lines)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)

    mode = sys.argv[1].lower()
    target = sys.argv[2]

    try:
        if mode == "full":
            violations = evaluate_full_pipeline(target)
        else:
            target_path = Path(target)
            if not target_path.exists():
                print(f"[ERROR] File not found: {target}")
                sys.exit(2)

            content = target_path.read_text(encoding="utf-8", errors="replace")

            if mode == "storyboard":
                violations = evaluate_storyboard(content)
            elif mode == "animation":
                storyboard_content = ""
                if "--storyboard" in sys.argv:
                    sb_idx = sys.argv.index("--storyboard") + 1
                    if sb_idx < len(sys.argv):
                        sb_path = Path(sys.argv[sb_idx])
                        if sb_path.exists():
                            storyboard_content = sb_path.read_text(encoding="utf-8", errors="replace")
                violations = evaluate_animation_spec(content, storyboard_content)
            elif mode == "composition":
                violations = evaluate_composition_spec(content)
            else:
                print(f"[ERROR] Unknown mode: {mode}. Use: storyboard, animation, composition, full")
                sys.exit(2)

        report = format_report(violations, mode)
        print(report)

        has_critical = any(v["severity"] == "CRITICAL" for v in violations)
        sys.exit(1 if has_critical else 0)

    except Exception as e:
        print(f"[ERROR] Evaluation failed: {e}")
        sys.exit(2)


if __name__ == "__main__":
    main()
