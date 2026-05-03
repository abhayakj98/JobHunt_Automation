import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// ── Report parser — auto-reads all files in reports/ ─────────────────────────

function parseReports() {
  const reportsDir = path.join(ROOT, 'reports');
  if (!fs.existsSync(reportsDir)) return [];

  const files = fs.readdirSync(reportsDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  return files.map(file => {
    const raw  = fs.readFileSync(path.join(reportsDir, file), 'utf8');
    const lines = raw.split('\n');

    // ── Company + Role from heading ────────────────────────────────────────
    let company = '', role = '';
    const h1 = lines.find(l => l.startsWith('# '));
    if (h1) {
      // "# Evaluación: Company — Role"  or  "# Evaluation Report: Role (Company)"
      const evalMatch = h1.match(/^#\s+Evaluaci[oó]n:\s*(.+?)\s*[—–-]+\s*(.+)$/i);
      const reportMatch = h1.match(/^#\s+Evaluation Report:\s*(.+?)\s*\((.+?)\)/i);
      if (evalMatch)   { company = evalMatch[1].trim();  role = evalMatch[2].trim(); }
      else if (reportMatch) { role = reportMatch[1].trim(); company = reportMatch[2].trim(); }
      else {
        // Fallback: derive from filename  NNN-company-slug-YYYY-MM-DD.md
        const slug = file.replace(/^\d+-/, '').replace(/-\d{4}-\d{2}-\d{2}\.md$/, '');
        company = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    // ── URL ────────────────────────────────────────────────────────────────
    const urlLine = lines.find(l => /\*\*URL:\*\*/.test(l));
    const url = urlLine ? (urlLine.match(/https?:\/\/\S+/) || [])[0] || '' : '';

    // ── Score ──────────────────────────────────────────────────────────────
    // Handles: **Score:** 4.7/5  |  (Score: 4.7/5)  |  Global Score: 4.8/5
    // Uses [^0-9]* to skip bold markers (**), colons, spaces between label and number
    let score = 0;
    for (const l of lines) {
      const m = l.match(/(?:Global\s+Score|Score)[^0-9]*(\d+\.\d+)\s*\/\s*5/i);
      if (m) { score = parseFloat(m[1]); break; }
    }

    // ── Location ──────────────────────────────────────────────────────────
    let location = 'India';
    for (const l of lines) {
      // Table row:  | **Location** | City |
      const tbl = l.match(/\|\s*\*?\*?Location\*?\*?\s*\|\s*(.+?)\s*\|/i);
      if (tbl) { location = tbl[1].replace(/\(.*?\)/g, '').trim(); break; }
      // Inline:     **Remote:** Hybrid (Mumbai)
      const rem = l.match(/\*\*Remote:\*\*\s*.+\((.+?)\)/i);
      if (rem) { location = rem[1].trim(); break; }
      // Bullet:     - **Location:** City
      const bul = l.match(/[-*]\s+\*\*Location:\*\*\s*(.+?)(?:\s*\(|$)/i);
      if (bul) { location = bul[1].trim(); break; }
    }
    // Normalise "Gurgaon" → "Gurugram"
    location = location.replace(/^Gurgaon$/i, 'Gurugram');

    // ── Experience ────────────────────────────────────────────────────────
    let experience = 'See JD';
    for (const l of lines) {
      // Table row:  | **Seniority** | Manager (3-7 years exp) |
      const tbl = l.match(/\|\s*\*?\*?Seniority\*?\*?\s*\|\s*.+?\((.+?years.*?)\)/i);
      if (tbl) { experience = tbl[1].replace(/\s+exp.*$/i, '').trim(); break; }
      // Inline:     **Seniority:** Manager (3-7 years)
      const inl = l.match(/\*\*Seniority:\*\*\s*.+?\((.+?years.*?)\)/i);
      if (inl) { experience = inl[1].replace(/\s+exp.*$/i, '').trim(); break; }
    }

    // ── Compensation ──────────────────────────────────────────────────────
    let compensation = 'NA';
    const compPatterns = [
      /\*\*Range:\*\*\s*(₹[^.\n]+)/i,
      /\*\*Target Candidate:\*\*\s*(₹[^.\n]+)/i,
      /\*\*Estimate:\*\*\s*(₹[^.\n]+)/i,
    ];
    for (const l of lines) {
      for (const pat of compPatterns) {
        const m = l.match(pat);
        if (m) { compensation = m[1].replace(/\s+total comp.*$/i, '').trim(); break; }
      }
      if (compensation !== 'NA') break;
    }

    // ── JD Summary ────────────────────────────────────────────────────────
    let jd_summary = '';
    for (const l of lines) {
      // Table:  | **TL;DR** | Summary |
      const tbl = l.match(/\|\s*\*?\*?TL;DR\*?\*?\s*\|\s*(.+?)\s*\|/i);
      if (tbl) { jd_summary = tbl[1].trim(); break; }
      // Inline:  **TL;DR:** Summary
      const inl = l.match(/\*\*TL;DR:\*\*\s*(.+)/i);
      if (inl) { jd_summary = inl[1].trim(); break; }
    }
    if (!jd_summary) {
      // Fallback: first non-empty line after "## A"
      let inA = false;
      for (const l of lines) {
        if (/^##\s+A[.)]/i.test(l)) { inA = true; continue; }
        if (inA && l.trim() && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('-')) {
          jd_summary = l.replace(/^[*_]+|[*_]+$/g, '').trim();
          break;
        }
      }
    }

    return {
      company,
      role,
      url: url || '',
      location,
      experience_required: experience,
      compensation,
      jd_summary,
      match_score: score,
      status: 'Open (verify)',
      applied: 'No',
      evaluated: true,
      source_file: file,
    };
  }).filter(r => r.match_score > 0); // drop unparseable files
}

// ── Load JD data for pending (non-evaluated) entries ─────────────────────────

function loadPending(evaluatedUrls) {
  const jdPath = path.join(ROOT, 'output/jd-data.json');
  if (!fs.existsSync(jdPath)) return [];
  const jdData = JSON.parse(fs.readFileSync(jdPath, 'utf8'));
  return jdData.filter(j => !evaluatedUrls.has(j.url));
}

// ── Parse scan-history.tsv → Map<url, first_seen> ────────────────────────────

function loadScrapedDates() {
  const tsvPath = path.join(ROOT, 'data/scan-history.tsv');
  const dates = new Map();
  if (!fs.existsSync(tsvPath)) return dates;
  const lines = fs.readFileSync(tsvPath, 'utf8').split('\n').slice(1); // skip header
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      const url = parts[0].trim();
      const date = parts[1].trim();
      if (!dates.has(url)) dates.set(url, date); // keep earliest
    }
  }
  return dates;
}

// ── Load contacts-data.json → Map<url, {hm, hr, referral}> ───────────────────
// Format per entry:
//   { hiring_manager: "Name (Title)", hiring_hr: "Name (Title)", referral: "Name (Title)" }

function loadContacts() {
  const p = path.join(ROOT, 'output/contacts-data.json');
  if (!fs.existsSync(p)) return new Map();
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  return new Map(Object.entries(raw));
}

// ── Build rows ────────────────────────────────────────────────────────────────

const evaluated    = parseReports();
const evaluatedUrls = new Set(evaluated.map(e => e.url).filter(Boolean));
const pending      = loadPending(evaluatedUrls);
const scrapedDates = loadScrapedDates();
const contacts     = loadContacts();

const rows = [];

function getPeople(url) {
  const c = contacts.get(url) || {};
  return {
    hiring_manager: c.hiring_manager || '—',
    hiring_hr:      c.hiring_hr      || '—',
    referral:       c.referral       || '—',
  };
}

for (const e of evaluated) {
  const people = getPeople(e.url);
  rows.push({
    company:        e.company,
    role:           e.role,
    url:            e.url,
    scraped_date:   scrapedDates.get(e.url) || '—',
    location:       e.location,
    experience:     e.experience_required,
    compensation:   e.compensation,
    jd_summary:     e.jd_summary || 'See full report in reports/',
    status:         e.status,
    applied:        e.applied,
    score_val:      e.match_score,
    score:          `${e.match_score}/5.0`,
    hiring_manager: people.hiring_manager,
    hiring_hr:      people.hiring_hr,
    referral:       people.referral,
    source:         'Full Report',
    inferred:       false,
  });
}

for (const j of pending) {
  const people = getPeople(j.url);
  rows.push({
    company:        j.company,
    role:           j.role,
    url:            j.url,
    scraped_date:   scrapedDates.get(j.url) || '—',
    location:       j.location || 'India',
    experience:     j.experience_required || 'See JD',
    compensation:   j.compensation || 'NA',
    jd_summary:     j.jd_summary || '',
    status:         j.status,
    applied:        'No',
    score_val:      j.match_score,
    score:          `${j.match_score}/5.0`,
    hiring_manager: people.hiring_manager,
    hiring_hr:      people.hiring_hr,
    referral:       people.referral,
    source:         j.inferred ? 'Inferred' : 'Fetched JD',
    inferred:       j.inferred,
  });
}

// Sort by match score descending
rows.sort((a, b) => b.score_val - a.score_val);

// ── Build Excel ──────────────────────────────────────────────────────────────

const wb = new ExcelJS.Workbook();
wb.creator = 'career-ops';
wb.created = new Date();

const ws = wb.addWorksheet('Job Openings', { views: [{ state: 'frozen', ySplit: 1 }] });

ws.columns = [
  { header: '#',                    key: 'num',            width: 5  },
  { header: 'Company Name',         key: 'company',        width: 28 },
  { header: 'Designation / Role',   key: 'role',           width: 42 },
  { header: 'Scraped Date',         key: 'scraped_date',   width: 14 },
  { header: 'Location',             key: 'location',       width: 16 },
  { header: 'Experience Required',  key: 'experience',     width: 18 },
  { header: 'Compensation',         key: 'compensation',   width: 22 },
  { header: 'JD Summary',           key: 'jd_summary',     width: 50 },
  { header: 'Application Status',   key: 'status',         width: 18 },
  { header: 'Applied (Yes/No)',      key: 'applied',        width: 14 },
  { header: 'Match Score',          key: 'score',          width: 14 },
  { header: 'Hiring Manager',       key: 'hiring_manager', width: 30 },
  { header: 'Hiring HR',            key: 'hiring_hr',      width: 30 },
  { header: 'Referral',             key: 'referral',       width: 30 },
  { header: 'Source',               key: 'source',         width: 14 },
  { header: 'Link',                 key: 'url',            width: 55 },
];

// Header
const headerRow = ws.getRow(1);
headerRow.eachCell(cell => {
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
  cell.font      = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border    = { bottom: { style: 'medium', color: { argb: 'FF1E3A5F' } } };
});
headerRow.height = 32;

function scoreColor(v) {
  if (v >= 4.5) return { bg: 'FFD4EFDF', fg: 'FF1A7A4A' };
  if (v >= 4.0) return { bg: 'FFD6EAF8', fg: 'FF2E6DB4' };
  if (v >= 3.5) return { bg: 'FFFFF3CD', fg: 'FFB08800' };
  return { bg: 'FFFDEDEC', fg: 'FFB03A2E' };
}

function statusBg(s) {
  if (s === 'Open')             return 'FFD4EFDF';
  if (s.startsWith('Open ('))  return 'FFFFF3CD';
  if (s === 'Expired')         return 'FFFDEDEC';
  return 'FFF5F5F5';
}

for (let i = 0; i < rows.length; i++) {
  const r   = rows[i];
  const bg  = i % 2 === 0 ? 'FFFAFAFA' : 'FFFFFFFF';
  const row = ws.addRow({
    num: i + 1, company: r.company, role: r.role,
    scraped_date: r.scraped_date, location: r.location,
    experience: r.experience, compensation: r.compensation,
    jd_summary: r.jd_summary, status: r.status, applied: r.applied,
    score: r.score, hiring_manager: r.hiring_manager,
    hiring_hr: r.hiring_hr, referral: r.referral,
    source: r.source, url: r.url,
  });

  row.eachCell({ includeEmpty: true }, cell => {
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.font      = { size: 10, name: 'Calibri' };
    cell.border    = {
      bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      right:  { style: 'thin', color: { argb: 'FFE0E0E0' } },
    };
  });

  // Hyperlink
  if (r.url) {
    const c = row.getCell('url');
    c.value = { text: r.url, hyperlink: r.url };
    c.font  = { size: 10, name: 'Calibri', color: { argb: 'FF1155CC' }, underline: true };
  }

  // Score colour
  const sc = scoreColor(r.score_val);
  const scoreCell = row.getCell('score');
  scoreCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: sc.bg } };
  scoreCell.font      = { bold: true, size: 10, name: 'Calibri', color: { argb: sc.fg } };
  scoreCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Status colour
  row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusBg(r.status) } };

  // Inferred source — italic grey
  if (r.inferred) {
    const c = row.getCell('source');
    c.font = { italic: true, size: 9, name: 'Calibri', color: { argb: 'FF888888' } };
  }

  // Evaluated (Full Report) — bold company
  if (r.source === 'Full Report') {
    row.getCell('company').font = { bold: true, size: 10, name: 'Calibri' };
  }

  row.height = 32;
}

ws.autoFilter = { from: 'A1', to: 'P1' };

// ── Summary sheet ─────────────────────────────────────────────────────────────
const ws2 = wb.addWorksheet('Summary');
ws2.columns = [
  { header: 'Metric', key: 'metric', width: 36 },
  { header: 'Value',  key: 'value',  width: 20 },
];

const s2h = ws2.getRow(1);
s2h.eachCell(cell => {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
  cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
  cell.alignment = { vertical: 'middle' };
});
s2h.height = 28;

const a45  = rows.filter(r => r.score_val >= 4.5).length;
const a40  = rows.filter(r => r.score_val >= 4.0 && r.score_val < 4.5).length;
const a35  = rows.filter(r => r.score_val >= 3.5 && r.score_val < 4.0).length;
const low  = rows.filter(r => r.score_val < 3.5).length;
const open = rows.filter(r => r.status === 'Open').length;
const verify = rows.filter(r => r.status === 'Open (verify)').length;
const expd = rows.filter(r => r.status === 'Expired').length;
const eval_ = rows.filter(r => r.source === 'Full Report').length;
const top5 = rows.slice(0, 5).map(r => `${r.company} (${r.score})`).join(', ');

const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

for (const d of [
  { metric: 'Generated at (UTC)',                  value: generatedAt },
  { metric: 'Total job openings tracked',           value: rows.length },
  { metric: 'Score ≥ 4.5 — Strong / Perfect match', value: a45 },
  { metric: 'Score 4.0–4.4 — Good match',           value: a40 },
  { metric: 'Score 3.5–3.9 — Decent / Adjacent',    value: a35 },
  { metric: 'Score < 3.5 — Stretch / Weak',         value: low },
  { metric: 'Status: Open (confirmed)',             value: open },
  { metric: 'Status: Open (needs manual verify)',   value: verify },
  { metric: 'Status: Expired',                      value: expd },
  { metric: 'Full evaluation reports exist',        value: eval_ },
  { metric: 'Applied',                              value: 0 },
  { metric: 'Top 5 by match score',                value: top5 },
]) {
  const r = ws2.addRow(d);
  r.getCell('metric').font = { size: 10, name: 'Calibri' };
  r.getCell('value').font  = { size: 10, name: 'Calibri', bold: typeof d.value === 'number' };
}

// ── Save ─────────────────────────────────────────────────────────────────────
const today   = new Date().toISOString().slice(0, 10);
function resolveOutPath() {
  const base = path.join(ROOT, 'output', `job-openings-${today}`);
  if (!fs.existsSync(`${base}.xlsx`)) return `${base}.xlsx`;
  // File exists — check if it's locked (Windows: try opening it)
  try { const fd = fs.openSync(`${base}.xlsx`, 'r+'); fs.closeSync(fd); return `${base}.xlsx`; } catch {}
  // Locked — find next available suffix
  for (let i = 2; i < 20; i++) {
    const p = `${base}_v${i}.xlsx`;
    if (!fs.existsSync(p)) return p;
    try { const fd = fs.openSync(p, 'r+'); fs.closeSync(fd); return p; } catch {}
  }
  return `${base}_${Date.now()}.xlsx`;
}
const outPath = resolveOutPath();
await wb.xlsx.writeFile(outPath);
console.log(`✅ Excel saved → ${outPath}`);
console.log(`   ${rows.length} rows | Reports parsed: ${eval_} | Pending: ${rows.length - eval_} | Expired: ${expd}`);
