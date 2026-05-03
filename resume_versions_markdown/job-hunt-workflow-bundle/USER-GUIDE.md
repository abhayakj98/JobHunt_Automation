# Job Hunt Workflow User Guide

## What This Skill Does

`job-hunt-workflow` is a reusable Codex skill for running a structured job search workflow. It helps with:

- sourcing and screening roles
- converting job postings into AI-friendly JD markdowns
- tailoring resumes by role family
- running final QA on markdown, HTML, and PDF outputs

It is designed around a candidate workflow similar to this repository: consumer marketing, PMM, growth, storefront, and analytics-led resume work with strong emphasis on truthfulness, fit, and final output quality.

## How To Install

1. Copy the `job-hunt-workflow/` folder into:

```bash
~/.codex/skills/job-hunt-workflow/
```

2. Confirm the main file exists:

```bash
~/.codex/skills/job-hunt-workflow/SKILL.md
```

3. Restart your Codex session if needed so the skill can be discovered cleanly.

## How To Use It

Use plain-language prompts. The skill should trigger when you ask for:

- help with job hunt
- resume tailoring
- relevant role sourcing
- JD markdown creation
- final resume QA

## Recommended Workflow

1. Reconstruct or confirm the active brief
2. Source and screen roles
3. Normalize the job into JD markdown
4. Tailor the resume by role family
5. Run final spillover / render / PDF QA

Do not skip the screening step.

## Where To Look For Details

- workflow rules: `job-hunt-workflow/SKILL.md`
- sourcing and fit rubric: `references/role-fit-criteria.md`
- JD normalization rules: `references/jd-markdown-conventions.md`
- resume rules: `references/resume-tailoring-guide.md`
- output and layout rules: `references/resume-output-conventions.md`
- final checks: `references/qa-checklist.md`
- examples: `references/cookbook.md`

## Operational Guardrails

- preserve user non-negotiables unless they directly hurt role fit
- never invent skills, experience, tools, or category depth
- prefer local evidence and current sources over memory
- validate spillover in rendered HTML before finalizing PDF
