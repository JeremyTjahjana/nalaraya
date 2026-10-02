import { expect, it } from 'vitest';
import { initial, reducer } from './lab';
import { liquidFeedback } from './liquidFeedback';

it('animates successful transfers and doses, never rejected actions or resets', () => {
  const start = initial('latihan');
  expect(liquidFeedback(start, reducer(start, {type:'fill'}))).toBeNull();
  const prepared = {...start, step:3, funnelPlaced:true};
  expect(liquidFeedback(prepared, reducer(prepared,{type:'fill'}))).toBe('fill');
  const titrating = {...start, step:8, indicator:true};
  const dosed = reducer(titrating,{type:'dose',value:1});
  expect(liquidFeedback(titrating,dosed)).toBe('dose');
  expect(liquidFeedback(dosed,reducer(dosed,{type:'reset'}))).toBeNull();
  expect(liquidFeedback({...start,step:5,pipetteLoaded:true},{...start,step:6})).toBe('transfer');
});
