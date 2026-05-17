import { useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
}

export function usePagination({ totalItems, pageSize, currentPage }: UsePaginationProps) {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return { totalPages, hasNext, hasPrev, currentPage, pageSize, totalItems };
  }, [totalItems, pageSize, currentPage]);
}
