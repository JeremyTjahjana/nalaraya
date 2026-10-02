export const labKeys = ['chemistry_titration', 'biology_onion_epidermis', 'chemistry_intro'] as const;
export type LabKey = typeof labKeys[number];
export type LabMode = 'latihan' | 'ujian';

export function nextProgress(current: { practice_completed: boolean; exam_completed: boolean; best_exam_score: number | null }, mode: LabMode, score: number | null) {
  return {
    practice_completed: current.practice_completed || mode === 'latihan',
    exam_completed: current.exam_completed || mode === 'ujian',
    best_exam_score: mode === 'ujian' && score !== null
      ? Math.max(current.best_exam_score ?? 0, score)
      : current.best_exam_score,
  };
}
