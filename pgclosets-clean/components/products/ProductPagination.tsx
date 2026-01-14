'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PaginationMeta } from '@/lib/types/api';

interface ProductPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export default function ProductPagination({
  pagination,
  onPageChange,
  maxVisiblePages = 7
}: ProductPaginationProps) {
  const { page, totalPages, hasMore, hasPrevious } = pagination;

  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, page + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages, maxVisiblePages]);

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const PageButton = ({
    pageNum,
    isActive = false,
    isDisabled = false,
    children,
    ariaLabel
  }: {
    pageNum?: number;
    isActive?: boolean;
    isDisabled?: boolean;
    children: React.ReactNode;
    ariaLabel?: string;
  }) => (
    <motion.button
      whileHover={!isDisabled && !isActive ? { scale: 1.05 } : {}}
      whileTap={!isDisabled && !isActive ? { scale: 0.95 } : {}}
      onClick={() => pageNum && handlePageClick(pageNum)}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative px-3 py-2 text-sm font-medium transition-all duration-200
        flex items-center justify-center min-w-[40px] h-10
        border border-pg-border rounded-lg
        ${
          isActive
            ? 'bg-pg-navy text-white border-pg-navy shadow-medium'
            : isDisabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-pg-dark hover:bg-pg-offwhite hover:border-pg-sky'
        }
      `}
    >
      {children}
    </motion.button>
  );

  return (
    <nav aria-label="Product pagination" className="flex items-center justify-center">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <PageButton
          pageNum={page - 1}
          isDisabled={!hasPrevious}
          ariaLabel="Go to previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PageButton>

        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <PageButton pageNum={1} ariaLabel="Go to page 1">
              1
            </PageButton>
            {visiblePages[0] > 2 && (
              <div className="px-2 py-2 text-pg-gray">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12a2 2 0 100-4 2 2 0 000 4zM12 12a2 2 0 100-4 2 2 0 000 4zM19 12a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((pageNum) => (
          <PageButton
            key={pageNum}
            pageNum={pageNum}
            isActive={pageNum === page}
            ariaLabel={`Go to page ${pageNum}`}
          >
            {pageNum}
          </PageButton>
        ))}

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <div className="px-2 py-2 text-pg-gray">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12a2 2 0 100-4 2 2 0 000 4zM12 12a2 2 0 100-4 2 2 0 000 4zM19 12a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
            )}
            <PageButton pageNum={totalPages} ariaLabel={`Go to page ${totalPages}`}>
              {totalPages}
            </PageButton>
          </>
        )}

        {/* Next Button */}
        <PageButton
          pageNum={page + 1}
          isDisabled={!hasMore}
          ariaLabel="Go to next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PageButton>
      </div>

      {/* Page Info */}
      <div className="ml-8 text-body-s text-pg-gray">
        Page {page} of {totalPages}
        <span className="hidden sm:inline">
          {' '}• {pagination.total} total products
        </span>
      </div>
    </nav>
  );
}