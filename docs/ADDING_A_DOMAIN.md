# Adding a New Domain to web-god

## Required Files

1. **Agent:** `agents/[domain]/[name].md`
2. **Skill:** `skills/[domain]/SKILL.md`
3. **Reference doc:** `skills/[domain]/references/[domain]-principles.md`

## Agent Template

```yaml
---
name: [domain]-[role]
description: >
  [What this agent does]. Use when "[trigger phrase 1]", "[trigger phrase 2]",
  "[trigger phrase 3]".
tools:
  - Read
  - Write
  - Grep
  - Glob
model: sonnet  # opus for deep reasoning tasks
---

# [Agent Title]

[Role description — what this agent does, what it produces.]

## [Core Methodology / Principles]
[Domain-specific rules and constraints]

## Output
[What the agent produces — tables, specs, code, reports]

## Constraints
[Hard rules the agent must follow]

## Chaining
- **Receives from:** [upstream agent name]
- **Hands off to:** [downstream agent name]
```

## Skill Template

```yaml
---
name: [domain]
description: >
  [Domain] skill. Use when "[trigger phrase 1]", "[trigger phrase 2]".
---

# [Domain] Skill

[One-line description.]

## Pipeline
1. **[Step]** — [What happens]
2. **[Step]** — [What happens]
3. **Validation** — [How to verify]

## Review Checklist
- [ ] [Checkpoint 1]
- [ ] [Checkpoint 2]

**Human checkpoint:** Present [deliverable] for approval before proceeding.

Consult `references/[domain]-principles.md` for domain-specific guidelines.
```

## Checklist

- [ ] Agent has YAML frontmatter with name, description, tools, model
- [ ] Agent description contains natural-language trigger phrases
- [ ] Skill references the agent by its exact `name:` field
- [ ] Skill has a review checklist and human checkpoint
- [ ] Reference doc is 60+ lines of substantive domain knowledge
- [ ] Added to README.md domain table
- [ ] Added to docs/AGENT_GUIDE.md
