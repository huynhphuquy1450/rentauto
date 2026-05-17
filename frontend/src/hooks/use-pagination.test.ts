import { describe, expect, it } from 'vitest';
import { usePagination } from './use-pagination';
import { renderHook } from '@testing-library/react';

describe('usePagination', () => {
  it('computes total pages correctly', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, pageSize: 10, currentPage: 1 })
    );
    expect(result.current.totalPages).toBe(3);
    expect(result.current.hasNext).toBe(true);
    expect(result.current.hasPrev).toBe(false);
  });

  it('flags last page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, pageSize: 10, currentPage: 3 })
    );
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrev).toBe(true);
  });

  it('handles empty list', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0, pageSize: 10, currentPage: 1 })
    );
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasNext).toBe(false);
    expect(result.current.hasPrev).toBe(false);
  });
});
