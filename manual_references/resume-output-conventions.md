# Resume Output Conventions

## Output Set

Every final resume should resolve to:
- Markdown source
- polished HTML
- final PDF

Use the `v2` suffix for the polished HTML/PDF when the layout has been refined beyond the first-pass export.

## File Naming

- Markdown: `Abhay_<Target>.md`
- HTML: `Abhay_<Target>_v2.html`
- PDF: `Abhay_<Target>_v2.pdf`

## Visual Grammar

- strong blue header
- orange section rules
- grey company / role bars
- Arial-based typography
- clean `CURRENT EXPERIENCE` / `PAST EXPERIENCE` hierarchy
- improved contact icons for phone, email, LinkedIn

## Typography Rules

- Prefer increasing hierarchy before shrinking body text
- Use bottom-page whitespace to improve emphasis and readability
- Reduce header footprint before compressing content if more room is needed

## HTML Output Rules

- Keep section names and date bars visually consistent
- Preserve one-page orientation
- Align the rendered structure to the approved global resume pattern

## Spillover Handling

- Validate at the HTML level, not just in Markdown
- If a bullet or line spills by 1-2 words:
  1. tighten the copy
  2. re-render HTML
  3. export PDF again
- Do not solve a local line problem by broadly shrinking the whole resume

## PDF Export Workflow

Preferred local export path:

```bash
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --headless \
  --disable-gpu \
  --print-to-pdf=/absolute/path/output.pdf \
  file:///absolute/path/input.html
```

## Render Verification

- Inspect rendered HTML or screenshot before accepting the PDF
- Confirm page count stays at one page
- Check that no section is visually denser than the rest

## Consistency Rules

- Keep the HTML and PDF in sync with the latest approved Markdown
- If content changes, refresh the HTML and PDF rather than editing only one output
