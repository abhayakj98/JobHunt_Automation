# Job Hunt Workflow Skill Install

## Bundle Contents

- `job-hunt-workflow/`: installable personal Codex skill
- `job-hunt-workflow/references/`: selective reference files used by the main skill
- `USER-GUIDE.md`: human-readable guide for installation and daily use
- `COOKBOOK.md`: quick-start examples you can reuse on another machine

## Install On Another Machine

1. Copy the `job-hunt-workflow/` folder into your Codex skills directory.
2. Target location:

```bash
~/.codex/skills/job-hunt-workflow/
```

3. Verify that this file exists after copy:

```bash
~/.codex/skills/job-hunt-workflow/SKILL.md
```

## Notes

- The installed `SKILL.md` uses only supported frontmatter keys: `name` and `description`.
- The skill expects local job-search artifacts and can be adapted to another candidate by editing the reference files.
- The workflow defaults to `web + local files + agents`, and does not assume MCP usage.
- If you want the fastest handoff, read `USER-GUIDE.md` first and then use `COOKBOOK.md` for prompt patterns.
