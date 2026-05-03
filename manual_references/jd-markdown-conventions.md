# JD Markdown Conventions

## Purpose

Normalize raw job postings into AI-friendly Markdown that can be reused for tailoring, comparison, and interview prep.

## File Naming

- Use lowercase, hyphenated filenames
- Pattern:
  - `company_role_5-years-experience.md`
  - `company_role_city_5-6yrs.md` for AI-sourced snapshots when needed

## Required Frontmatter

```yaml
---
company: Google
job_title: "Product Marketing Manager, Google Search"
min_years_experience: 6
experience_requirement: "6 years in marketing across growth, product marketing, brand marketing, or social, plus cross-functional project leadership."
location: "Gurugram, Haryana, India"
status: open
source_quality: "official-live"
source_url: https://...
captured_on: 2026-04-24
fit_note: "Best India PMM match in the set for GTM, analytics, and product-marketing crossover."
notes: "Refreshed from the current official URL."
resume_angle: "Data-driven PMM for consumer products with GTM, experiments, growth marketing, and cross-functional influence."
resume_targeting_keywords: "go-to-market strategy, product marketing, growth marketing, experiments, analytics"
---
```

## Standard Sections

- `# <Role Title>`
- `## Snapshot`
- `## Role Summary`
- `## Core Responsibilities`
- `## Requirements Snapshot`
- `## Resume Tailoring Signals`

## Source Quality Labels

- `official-live`
- `official-partial`
- `mirror-derived`
- `indexed-fallback`

Use the strongest truthful label available.

## When Extraction Is Partial

- Keep the role if the source is still useful
- Say what was confirmed vs inferred
- Put that explanation in `notes`
- Do not silently invent requirement bars or status

## Tailoring Signals Section

Always include:
- headline angle
- strongest foreground evidence to pull into the resume
- phrases to mirror naturally
- what to de-emphasize

## Guardrails

- Prefer official URLs when available
- Record capture date
- Make stale or uncertain status visible
- Write for reuse by another agent, not just human reading
