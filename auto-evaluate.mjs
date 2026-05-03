#!/usr/bin/env node

/**
 * auto-evaluate.mjs — Processes data/pipeline.md and evaluates pending items
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

const PIPELINE_PATH = 'data/pipeline.md';

async function fetchJd(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000); // Wait for hydration
    return await page.evaluate(() => document.body?.innerText ?? '');
  } catch (err) {
    console.error(`  ❌ Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

async function main() {
  if (!existsSync(PIPELINE_PATH)) {
    console.error('pipeline.md not found.');
    return;
  }

  const content = readFileSync(PIPELINE_PATH, 'utf-8');
  const lines = content.split('\n');
  const pendingIndices = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('- [ ]')) {
      pendingIndices.push(i);
    }
  }

  if (pendingIndices.length === 0) {
    console.log('No pending items in pipeline.');
    return;
  }

  console.log(`Processing ${pendingIndices.length} pending items...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const idx of pendingIndices) {
    const line = lines[idx];
    const urlMatch = line.match(/- \[ \] (https?:\/\/\S+)/);
    if (!urlMatch) continue;

    const url = urlMatch[1];
    console.log(`\nEvaluating: ${url}`);

    const jdText = await fetchJd(page, url);
    if (!jdText || jdText.length < 500) {
      console.log('  ⚠️ JD too short or fetch failed. Skipping.');
      lines[idx] = lines[idx].replace('- [ ]', '- [!]');
      continue;
    }

    // Run gemini-eval.mjs
    const result = spawnSync('node', ['gemini-eval.mjs', jdText], { encoding: 'utf-8' });
    
    if (result.status !== 0) {
      console.error('  ❌ gemini-eval failed.');
      lines[idx] = lines[idx].replace('- [ ]', '- [!]');
      continue;
    }

    // Extract score and report number from output or reports/
    // Simplification: just mark as processed in pipeline for now.
    // The gemini-eval script already saves the report.
    lines[idx] = lines[idx].replace('- [ ]', '- [x]');
    console.log('  ✅ Evaluated successfully.');
  }

  await browser.close();

  // Move processed items to Procesadas section
  const newPending = [];
  const newProcesadas = [];
  let inPendientes = false;
  let inProcesadas = false;

  for (const line of lines) {
    if (line.startsWith('## Pendientes')) { inPendientes = true; inProcesadas = false; continue; }
    if (line.startsWith('## Procesadas')) { inPendientes = false; inProcesadas = true; continue; }

    if (inPendientes && line.startsWith('- [x]')) {
       newProcesadas.push(line);
    } else if (inPendientes && line.trim()) {
       newPending.push(line);
    }
  }

  // Reconstruct file
  let newContent = '## Pendientes\n' + newPending.join('\n') + '\n\n## Procesadas\n';
  // Read existing procesadas
  const oldProcesadasMatch = content.match(/## Procesadas\n([\s\S]*)/);
  if (oldProcesadasMatch) {
    newContent += newProcesadas.join('\n') + '\n' + oldProcesadasMatch[1].trim();
  } else {
    newContent += newProcesadas.join('\n');
  }

  writeFileSync(PIPELINE_PATH, newContent.trim() + '\n', 'utf-8');
  console.log('\nPipeline updated.');
}

main().catch(console.error);
