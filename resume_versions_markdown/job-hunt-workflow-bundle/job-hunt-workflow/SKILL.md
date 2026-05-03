---
name: job-hunt-workflow
description: Use when the user wants end-to-end job search help: sourcing roles, screening against a locked brief, converting postings into JD markdowns, tailoring resumes by role family, or generating final HTML/PDF application outputs with QA.
---

# Job Hunt Workflow

## Overview

Use this skill for Abhay-style job search operations where the work spans sourcing, screening, JD normalization, resume tailoring, and final output QA. Optimize for truthful fit, repeatable workflow, and submit-worthy artifacts rather than generic career advice.

## Required Starting Context

- Active brief or enough history to reconstruct it
- Latest global base resume in Markdown
- Existing `jobs_markdown/` and `resume_markdown/` outputs to avoid duplication
- A target job posting, or a sourcing request

If the brief is missing, derive it from project history first. Do not start tailoring until the role has passed screening.

## Phase 0: Initialize Context

1. Recover or confirm the locked brief, role-family preferences, geography, and seniority floor.
2. Inspect existing job and resume files so work is incremental, not duplicative.
3. Identify the role family before choosing summary language or proof points.
4. Default to `web + local files + agents`; avoid MCP unless explicitly requested or a tracked sheet/doc cannot be reasoned about locally.

**Reference**: `references/role-fit-criteria.md`

## Phase 1: Job Sourcing & Screening

1. Source current roles from official career pages first, then high-signal portals.
2. Screen each role against the active brief before recommending it.
3. Use a maker-checker pattern:
   - maker finds candidates and drafts fit rationale
   - checker demotes weak-fit, stale, closed, or seniority-mismatched roles
4. Return only prioritized roles with links, fit rationale, and explicit caveats.

**Reference**: `references/role-fit-criteria.md`

## Phase 2: JD Markdown Creation

1. Extract the role title, company, location, experience bar, current status, and source quality.
2. Normalize the job into AI-friendly Markdown with consistent frontmatter and sections.
3. Record fallback assumptions when official extraction is partial or blocked.

**Reference**: `references/jd-markdown-conventions.md`

## Phase 3: Resume Tailoring by Role Family

1. Identify the role family: brand/category, PMM/GTM, storefront/growth, or analytics/measurement.
2. Tailor the summary, proof order, skills buckets, and awards emphasis for that family.
3. Preserve core structure unless a change materially improves candidacy.
4. Keep all claims defensible. Never force unsupported ATS keywords.

**Reference**: `references/resume-tailoring-guide.md`

## Phase 4: QA & Output Generation

1. Finalize the Markdown first.
2. Convert it into the approved HTML visual system.
3. Export PDF only after rendered HTML looks correct.
4. Tighten any line that spills by 1-2 words before changing layout or shrinking body text.
5. Verify file existence, page count, and final readability.

**Reference**: `references/resume-output-conventions.md` and `references/qa-checklist.md`

## Guardrails

- Never skip Phase 1 screening. No tailoring until the job passes the active brief.
- Always preserve user non-negotiables unless they directly harm role fit; if so, flag the conflict explicitly.
- Never invent experience, tools, categories, or seniority signals.
- Prefer local evidence and existing artifacts over memory.
- Run a final rendered QA pass before calling any resume submit-worthy.

## Selective Reference Loading

- Load `role-fit-criteria.md` when sourcing, screening, or refreshing the brief.
- Load `jd-markdown-conventions.md` when normalizing job postings.
- Load `resume-tailoring-guide.md` when tailoring for a specific role.
- Load `resume-output-conventions.md` when producing HTML/PDF outputs.
- Load `qa-checklist.md` before finalizing anything for submission.
- Load `cookbook.md` when the user wants concrete prompt patterns, examples, or reusable operating flows.
