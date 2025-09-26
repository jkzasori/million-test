import React from 'react';

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
    <div className={`luxury-pagination ${className}`}>
      {/* Progress Bar */}
      <div className="pagination-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          <span className="progress-current">Page {currentPage}</span>
          <span className="progress-separator">of</span>
          <span className="progress-total">{totalPages}</span>
        </div>
      </div>

      {/* Items Info */}
      <div className="items-info">
        <div className="items-text">
          Showing <span className="text-luxury font-semibold">{startItem.toLocaleString()}</span> to{' '}
          <span className="text-luxury font-semibold">{endItem.toLocaleString()}</span> of{' '}
          <span className="text-luxury font-semibold">{totalCount.toLocaleString()}</span> properties
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`nav-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          title="Previous page"
        >
          <span className="nav-icon">←</span>
          <span className="nav-text">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {visiblePages.map((pageNum, index) => (
            <button
              key={index}
              className={`page-btn ${
                pageNum === currentPage ? 'active' : ''
              } ${pageNum === '...' ? 'dots' : ''}`}
              onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
              disabled={pageNum === '...' || loading}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className={`nav-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          title="Next page"
        >
          <span className="nav-text">Next</span>
          <span className="nav-icon">→</span>
        </button>
      </div>

      {/* Quick Jump */}
      <div className="quick-jump">
        <span className="jump-label">Go to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value=""
          placeholder={currentPage.toString()}
          className="jump-input input-luxury"
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

      <style jsx>{`
        .luxury-pagination {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          margin-top: 2rem;
          box-shadow: var(--shadow-lg);
        }

        .pagination-progress {
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .progress-bar {
          position: relative;
          height: 6px;
          background: var(--color-surface);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-accent);
          border-radius: 3px;
          transition: width 0.6s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .progress-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .progress-current,
        .progress-total {
          color: var(--color-accent);
          font-weight: 600;
        }

        .items-info {
          text-align: center;
        }

        .items-text {
          color: var(--color-text-secondary);
          font-size: 0.875rem;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .nav-btn:hover:not(.disabled) {
          transform: translateY(-1px);
          background: var(--color-surface);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-md);
        }

        .nav-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .nav-icon {
          font-size: 1.125rem;
          transition: transform 0.3s ease;
        }

        .prev-btn:hover:not(.disabled) .nav-icon {
          transform: translateX(-2px);
        }

        .next-btn:hover:not(.disabled) .nav-icon {
          transform: translateX(2px);
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-btn {
          min-width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-normal);
          font-size: 0.875rem;
        }

        .page-btn:hover:not(.active):not(.dots):not(:disabled) {
          transform: translateY(-1px);
          background: var(--color-surface);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-sm);
        }

        .page-btn.active {
          background: var(--color-accent);
          color: white;
          border-color: var(--color-accent);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .page-btn.dots {
          border: none;
          cursor: default;
          color: var(--color-text-secondary);
        }

        .page-btn.dots:hover {
          background: transparent;
          transform: none;
        }

        .quick-jump {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .jump-label {
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .jump-input {
          width: 4rem;
          text-align: center;
          padding: 0.5rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
        }

        .jump-input:focus {
          box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.3);
          border-color: var(--color-accent);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .luxury-pagination {
            padding: 1.5rem;
            gap: 1.5rem;
          }

          .pagination-controls {
            gap: 0.75rem;
          }

          .nav-btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .nav-text {
            display: none;
          }

          .page-btn {
            min-width: 2.5rem;
            height: 2.5rem;
            font-size: 0.8rem;
          }

          .page-numbers {
            gap: 0.25rem;
          }

          .quick-jump {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .luxury-pagination {
            padding: 1rem;
            gap: 1rem;
          }

          .pagination-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .page-numbers {
            order: -1;
          }

          .progress-text {
            font-size: 0.8rem;
          }

          .items-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LuxuryPagination;