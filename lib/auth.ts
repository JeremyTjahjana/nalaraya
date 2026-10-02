export const roles = ['student', 'teacher'] as const;
export const grades = ['10', '11', '12', 'university', 'other'] as const;
export const sources = ['school', 'friend', 'social', 'search', 'other'] as const;

export function safeNext(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  try {
    const url = new URL(value, 'https://nalaraya.local');
    return url.origin === 'https://nalaraya.local' ? url.pathname + url.search + url.hash : fallback;
  } catch {
    return fallback;
  }
}

export function validOnboarding(input: { role: string; grade: string; source: string }) {
  return roles.includes(input.role as typeof roles[number]) &&
    grades.includes(input.grade as typeof grades[number]) &&
    sources.includes(input.source as typeof sources[number]);
}
