import { describe, expect, it } from 'vitest';
import { safeNext, validOnboarding } from './auth';
import { nextProgress } from './progress';

describe('account flow', () => {
  it('keeps local destinations and rejects external redirects', () => {
    expect(safeNext('/kimia/titrasi/praktikum?mode=ujian')).toBe('/kimia/titrasi/praktikum?mode=ujian');
    for (const unsafe of ['https://example.com', '//example.com', '/\\example.com']) {
      expect(safeNext(unsafe)).toBe('/dashboard');
    }
  });
  it('requires valid onboarding selections', () => {
    expect(validOnboarding({ role: 'teacher', grade: 'other', source: 'school' })).toBe(true);
    expect(validOnboarding({ role: 'admin', grade: '10', source: 'search' })).toBe(false);
  });
  it('preserves best exam score across later attempts', () => {
    const first = nextProgress({ practice_completed: true, exam_completed: true, best_exam_score: 91 }, 'ujian', 72);
    expect(first.best_exam_score).toBe(91);
    expect(nextProgress(first, 'ujian', 96).best_exam_score).toBe(96);
    expect(nextProgress(first, 'latihan', null).best_exam_score).toBe(91);
  });
});
