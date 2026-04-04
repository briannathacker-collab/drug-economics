#!/usr/bin/env tsx
// Drug Economics — Data Validation Script
// Validates all JSON data files in /data against Zod schemas.
// Used in GitHub Actions CI pipeline and can be run locally:
//   npx tsx scripts/validate-data.ts
//
// Exit code 0 = all files valid
// Exit code 1 = one or more validation errors

import { join } from 'path';
import { validateAllData } from '../src/lib/validate';

const dataDir = join(__dirname, '..', 'data');

console.log('=== Drug Economics Data Validation ===\n');
console.log(`Data directory: ${dataDir}\n`);

const result = validateAllData(dataDir);

for (const file of result.files) {
  if (file.valid) {
    console.log(`  PASS  ${file.file} (${file.recordCount} records)`);
  } else {
    console.log(`  FAIL  ${file.file} (${file.recordCount} records)`);
    for (const error of file.errors) {
      console.log(`        ${error}`);
    }
  }

  for (const warning of file.warnings) {
    console.log(`  WARN  ${warning}`);
  }
}

console.log('');
console.log(`Files validated: ${result.files.length}`);
console.log(`Total errors:    ${result.totalErrors}`);
console.log(`Total warnings:  ${result.totalWarnings}`);
console.log('');

if (result.valid) {
  console.log('All data files passed validation.');
  process.exit(0);
} else {
  console.error('Data validation FAILED. See errors above.');
  process.exit(1);
}
