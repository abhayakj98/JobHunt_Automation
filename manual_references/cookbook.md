# Cookbook

## Purpose

Use these examples as starting prompts and operating patterns for the `job-hunt-workflow` skill. Adapt them to the active brief instead of copying them blindly.

## 1. Reconstruct The Active Brief

**User prompt**

```text
Review the existing job-search files and recover my current locked brief before sourcing anything new.
```

**Expected behavior**

- inspect local job / resume artifacts
- infer geography, seniority, and role-family preferences
- summarize the brief before sourcing

## 2. Source New Roles

**User prompt**

```text
Find net-new India roles that match my brief. Prioritize PMM, growth, and consumer-tech roles. Screen for fit and return a shortlist with rationale.
```

**Expected behavior**

- source current roles
- remove duplicates
- apply maker-checker screening
- return only prioritized matches

## 3. Create A JD Markdown

**User prompt**

```text
Create an AI-friendly markdown for this job posting and save it using the project naming convention.
```

**Expected behavior**

- normalize the posting into frontmatter + standard sections
- label source quality truthfully
- include resume-tailoring signals

## 4. Tailor A Resume For A Brand Role

**User prompt**

```text
Use my global resume and tailor a submit-worthy version for this premium brand marketing role. Keep HUL grouped and optimize for brand-building fit.
```

**Expected behavior**

- use brand/category summary language
- foreground premium positioning, partnerships, media, storytelling
- keep titles credible and metric-led

## 5. Tailor A Resume For PMM / GTM

**User prompt**

```text
Tailor my resume for this PMM role. Optimize for GTM, experimentation, product launches, analytics, and cross-functional execution.
```

**Expected behavior**

- use PMM / GTM summary language
- foreground A/B testing, playbooks, launch execution, analytics
- de-emphasize pure ATL storytelling unless tied to adoption or growth

## 6. Tailor A Resume For Analytics / Measurement

**User prompt**

```text
Tailor my resume for this marketing analytics role. Keep it truthful and do not force unsupported keywords like SQL or churn prediction.
```

**Expected behavior**

- foreground research, analysis, experimentation, reporting, recommendations
- keep unsupported analyst buzzwords out
- tighten wording for measurement fit

## 7. Run Final QA

**User prompt**

```text
Do a final QA pass on the markdown, HTML, and PDF. Fix any line spillover caused by 1-2 words and verify the final export is one page.
```

**Expected behavior**

- check content coherence
- inspect rendered HTML
- tighten only wrap-prone lines
- regenerate PDF and verify one-page output

## 8. Commit Learnings Into Workflow Memory

**User prompt**

```text
Capture today’s reusable learnings into the workflow memory, but only after the final resume version is approved.
```

**Expected behavior**

- avoid premature memory commits
- extract only reusable rules
- update the learning file or skill references cleanly

## Common Anti-Patterns

- tailoring a resume before screening the role against the brief
- forcing ATS keywords that the candidate cannot defend
- solving line spillover by shrinking the whole page
- reusing the same summary across brand, PMM, storefront, and analytics roles
- recommending attractive but low-ROI roles without clearly marking the stretch
