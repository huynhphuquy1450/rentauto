import { describe, expect, it } from 'vitest';
import { formatVND, formatDate, calculateDays, calculateTotal } from './formatters';

describe('formatVND', () => {
  it('formats USD price into VND with 25k rate', () => {
    expect(formatVND(100)).toBe('2.500.000 VNĐ');
  });

  it('handles zero', () => {
    expect(formatVND(0)).toBe('0 VNĐ');
  });
});

describe('formatDate', () => {
  it('formats ISO date to vi-VN locale', () => {
    expect(formatDate('2024-12-25T00:00:00.000Z')).toMatch(/25.*12.*2024|12.*25.*2024/);
  });
});

describe('calculateDays', () => {
  it('returns 1 day for same date', () => {
    expect(calculateDays('2024-01-01', '2024-01-01')).toBe(1);
  });

  it('counts inclusive days', () => {
    expect(calculateDays('2024-01-01', '2024-01-03')).toBe(3);
  });

  it('returns 0 when end before start', () => {
    expect(calculateDays('2024-01-05', '2024-01-01')).toBe(0);
  });
});

describe('calculateTotal', () => {
  it('multiplies price by inclusive days', () => {
    expect(calculateTotal(100, '2024-01-01', '2024-01-03')).toBe(300);
  });
});
