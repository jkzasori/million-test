import React from 'react';
import styles from './LuxuryPagination.module.css';

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface LuxuryPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
}

const LuxuryPagination: React.FC<LuxuryPaginationProps> = ({
  pagination,
  onPageChange,
  loading = false,
  className = ''
}) => {
  const { page: currentPage, totalPages, totalCount, pageSize } = pagination;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    if (totalPages <= 1) return [1];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Calculate current items range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={`${styles.luxuryPagination} ${className}`}>
      {/* Progress Bar */}
      <div className={styles.paginationProgress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          <span className={styles.progressCurrent}>Page {currentPage}</span>
          <span className={styles.progressSeparator}>of</span>
          <span className={styles.progressTotal}>{totalPages}</span>
        </div>
      </div>

      {/* Items Info */}
      <div className={styles.itemsInfo}>
        <div className={styles.itemsText}>
          Showing <span className="text-luxury font-semibold">{startItem.toLocaleString()}</span> to{' '}
          <span className="text-luxury font-semibold">{endItem.toLocaleString()}</span> of{' '}
          <span className="text-luxury font-semibold">{totalCount.toLocaleString()}</span> properties
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={styles.paginationControls}>
        {/* Previous Button */}
        <button
          className={`${styles.navBtn} ${styles.prevBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          title="Previous page"
        >
          <span className={styles.navIcon}>←</span>
          <span className={styles.navText}>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className={styles.pageNumbers}>
          {visiblePages.map((pageNum, index) => (
            <button
              key={index}
              className={`${styles.pageBtn} ${
                pageNum === currentPage ? styles.active : ''
              } ${pageNum === '...' ? styles.dots : ''}`}
              onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
              disabled={pageNum === '...' || loading}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`${styles.navBtn} ${styles.nextBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          title="Next page"
        >
          <span className={styles.navText}>Next</span>
          <span className={styles.navIcon}>→</span>
        </button>
      </div>

      {/* Quick Jump */}
      <div className={styles.quickJump}>
        <span className={styles.jumpLabel}>Go to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value=""
          placeholder={currentPage.toString()}
          className={`${styles.jumpInput} input-luxury`}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages && page !== currentPage) {
              onPageChange(page);
              e.target.value = '';
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt((e.target as HTMLInputElement).value);
              if (page >= 1 && page <= totalPages && page !== currentPage) {
                onPageChange(page);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
          disabled={loading}
        />
      </div>

    </div>
  );
};

export default LuxuryPagination;