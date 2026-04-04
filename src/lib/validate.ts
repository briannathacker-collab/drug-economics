// Drug Economics — Runtime Data Validation Utility
// Opt-in validation layer using Zod schemas. Used by:
//   - scripts/validate-data.ts (CI pipeline)
//   - bots/integrity bot
//   - manual data audits
// Does NOT modify the existing data.ts loading — validation is opt-in.

import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DATA_FILE_SCHEMAS } from './schemas';

// ─── Types ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileValidationResult extends ValidationResult {
  file: string;
  recordCount: number;
}

export interface FullValidationResult {
  valid: boolean;
  files: FileValidationResult[];
  totalErrors: number;
  totalWarnings: number;
}

// ─── Core validation ──────────────────────────────────────────────

/**
 * Validate an unknown value against a Zod schema.
 * Returns structured errors on failure rather than throwing.
 */
export function validateData<T>(
  data: unknown,
  schema: z.ZodType<T>,
  label: string,
): ValidationResult {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: [], warnings: [] };
  }

  const errors = result.error.issues.map((e) => {
    const path = e.path.length > 0 ? e.path.join('.') : '(root)';
    return `[${label}] ${path}: ${e.message}`;
  });

  return { valid: false, errors, warnings: [] };
}

/**
 * Validate a single JSON data file against its corresponding schema.
 * Reads the file from disk using the provided data directory path.
 */
export function validateFile(
  filename: string,
  dataDir: string,
): FileValidationResult {
  const schema = DATA_FILE_SCHEMAS[filename as keyof typeof DATA_FILE_SCHEMAS];

  if (!schema) {
    return {
      file: filename,
      valid: false,
      errors: [`No schema defined for ${filename}`],
      warnings: [],
      recordCount: 0,
    };
  }

  let raw: unknown;
  try {
    const content = readFileSync(join(dataDir, filename), 'utf-8');
    raw = JSON.parse(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      file: filename,
      valid: false,
      errors: [`Failed to read/parse ${filename}: ${message}`],
      warnings: [],
      recordCount: 0,
    };
  }

  const recordCount = Array.isArray(raw) ? raw.length : 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = validateData(raw, schema as z.ZodType<any>, filename);

  return {
    file: filename,
    ...result,
    recordCount,
  };
}

/**
 * Validate all 15 JSON data files in the /data directory.
 * Returns an aggregate result with per-file details.
 */
export function validateAllData(
  dataDir?: string,
): FullValidationResult {
  const resolvedDir = dataDir ?? join(process.cwd(), 'data');
  const filenames = Object.keys(DATA_FILE_SCHEMAS);

  const files = filenames.map((filename) => validateFile(filename, resolvedDir));

  const totalErrors = files.reduce((sum, f) => sum + f.errors.length, 0);
  const totalWarnings = files.reduce((sum, f) => sum + f.warnings.length, 0);

  return {
    valid: totalErrors === 0,
    files,
    totalErrors,
    totalWarnings,
  };
}
