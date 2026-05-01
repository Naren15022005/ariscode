import { describe, it, expect } from 'vitest';
import { searchErrorSolutions, INITIAL_ERRORS } from '../src/lib/errors';

describe('Error Command', () => {
  it('should find exact match for known error', async () => {
    const results = await searchErrorSolutions('Cannot find module');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].pattern).toContain('Cannot find module');
    expect(results[0].confidence).toBeDefined();
  });

  it('should find by keywords', async () => {
    const results = await searchErrorSolutions('module not found typescript');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return array for unknown error', async () => {
    const results = await searchErrorSolutions('super rare error xyz123');
    expect(Array.isArray(results)).toBe(true);
  });

  it('should search in hardcoded errors as fallback', async () => {
    const results = await searchErrorSolutions('EADDRINUSE');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Puerto');
  });

  it('initial errors should have required fields', () => {
    INITIAL_ERRORS.forEach(error => {
      expect(error.pattern).toBeDefined();
      expect(error.title).toBeDefined();
      expect(error.explanation).toBeDefined();
      expect(error.fix).toBeDefined();
    });
  });
});
