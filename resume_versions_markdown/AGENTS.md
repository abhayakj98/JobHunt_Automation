# Repository Guidelines

## Project Structure & Module Organization
This repository is a document workspace for Abhay's job search, not an application codebase. Keep content grouped by purpose:

- `jobs_markdown/`: manually curated job descriptions and playbooks.
- `markdown_jobs_found_by_ai/`: AI-sourced job summaries and role snapshots.
- `resume_markdown/`: resume variants and tailored deliverables in `.md`, `.html`, and `.pdf`.
- Root files such as `ai_searched_jobs.txt` and `relevant_resources.txt`: indexes, search notes, and source pointers.
- `.venv/`: optional local Python environment for document-processing utilities.

## Build, Test, and Development Commands
There is no formal build pipeline. Use a few lightweight commands for local work:

- `rg --files`: list repository files quickly.
- `find jobs_markdown resume_markdown -maxdepth 1 -type f | sort`: inspect generated outputs.
- `python3 -m http.server 8123`: preview local HTML or PDF files in a browser.
- `.venv/bin/python -m pip install pypdf`: install the PDF parsing dependency used in this workspace.

## Coding Style & Naming Conventions
Prefer concise, AI-friendly Markdown with clear `#` / `##` headings and short bullet lists. Keep prose direct and role-specific.

- Job files in `jobs_markdown/` should follow lowercase, hyphenated names such as `company_role_5-years-experience.md`.
- AI-sourced job files may include city and experience, for example `company_role_city_5-6yrs.md`.
- Tailored resume outputs should keep the candidate-first pattern: `Abhay_<Target>_Tailored.md`, plus matching `.html` and `.pdf` files when exported.

## Testing Guidelines
This repository uses manual verification rather than automated tests.

- Open each generated Markdown file and confirm section order, links, and readability.
- When exporting resumes, verify that `.md`, `.html`, and `.pdf` versions all exist and match the intended role.
- Spot-check job files for stale links, missing experience requirements, or unnormalized formatting before reuse.

## Commit & Pull Request Guidelines
This folder is not currently a Git repository, so there is no local commit history to infer conventions from. If you place it under Git, use short imperative subjects such as `docs: add bacardi tailored resume` or `jobs: add april sourced shortlist`.

Pull requests should include:
- a brief summary of changed folders,
- source links for any newly added jobs,
- screenshots only when HTML/PDF resume layout changes,
- a note describing manual verification performed.

## Security & Data Handling
Treat resumes, phone numbers, email addresses, and spreadsheet links as sensitive. Do not add secrets, cookies, or raw portal session data to tracked files.
