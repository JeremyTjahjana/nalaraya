import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';

afterEach(() => vi.unstubAllEnvs());

it('moves login requests from the bind address to localhost before OAuth starts', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  const response = await proxy(new NextRequest('http://0.0.0.0:3000/masuk?next=%2Fdashboard'));
  expect(response.headers.get('location')).toBe('http://localhost:3000/masuk?next=%2Fdashboard');
});
