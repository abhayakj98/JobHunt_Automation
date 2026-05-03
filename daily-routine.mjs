#!/usr/bin/env node

/**
 * daily-routine.mjs — Master script for the daily job search routine
 */

import { spawnSync } from 'child_process';

const steps = [
  { name: 'Check Liveness', command: 'node', args: ['check-liveness.mjs', '--file', 'data/scan-history.tsv'] }, // Note: history check might need adaptation
  { name: 'Scan Portals', command: 'node', args: ['scan.mjs'] },
  { name: 'Evaluate New Entries', command: 'node', args: ['auto-evaluate.mjs'] },
  { name: 'Find Contacts', command: 'node', args: ['find-contacts.mjs'] },
  { name: 'Generate Excel', command: 'node', args: ['generate-jobs-excel.mjs'] },
  { name: 'Verify Pipeline', command: 'node', args: ['verify-pipeline.mjs'] },
];

console.log('🚀 Starting Daily Routine...\n');

for (const step of steps) {
  console.log(`\n🔹 STEP: ${step.name}`);
  console.log('═'.repeat(40));
  
  const result = spawnSync(step.command, step.args, { stdio: 'inherit' });
  
  if (result.status !== 0) {
    console.error(`\n❌ Step "${step.name}" failed with exit code ${result.status}`);
    // Continue for now, but mark failure
  } else {
    console.log(`\n✅ Step "${step.name}" completed.`);
  }
}

console.log('\n🏁 Daily Routine Finished.');
