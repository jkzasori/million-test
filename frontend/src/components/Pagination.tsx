'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="glass card-luxury p-8 mt-12 animate-slide-up">
      {/* Mobile Pagination */}
      <div className="flex flex-col sm:hidden space-y-4">
        <div className="text-center">
          <p className="text-white/80 text-sm">
            Page <span className="text-luxury font-semibold">{currentPage}</span> of{' '}
            <span className="text-luxury font-semibold">{totalPages}</span>
          </p>
          <p className="text-white/60 text-xs mt-1">
            {startItem}-{endItem} of {totalCount.toLocaleString()} properties
          </p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span>
            <span>Previous</span>
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Results Info */}
        <div className="flex items-center space-x-4">
          <div className="text-white/80">
            <span className="text-sm">Showing </span>
            <span className="text-luxury font-semibold">{startItem.toLocaleString()}</span>
            <span className="text-sm"> - </span>
            <span className="text-luxury font-semibold">{endItem.toLocaleString()}</span>
            <span className="text-sm"> of </span>
            <span className="text-luxury font-semibold">{totalCount.toLocaleString()}</span>
            <span className="text-sm"> exceptional properties</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all duration-300 group"
            title="Previous page"
          >
            <svg
              className="h-5 w-5 text-white/80 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* First page if not visible */}
          {pages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="glass hover:bg-white/20 px-4 py-2 rounded-xl text-white/80 hover:text-white font-medium transition-all duration-300"
              >
                1
              </button>
              {pages[0] > 2 && (
                <span className="text-white/40 px-2">⋯</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold shadow-lg'
                  : 'glass hover:bg-white/20 text-white/80 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page if not visible */}
          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="text-white/40 px-2">⋯</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="glass hover:bg-white/20 px-4 py-2 rounded-xl text-white/80 hover:text-white font-medium transition-all duration-300"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all duration-300 group"
            title="Next page"
          >
            <svg
              className="h-5 w-5 text-white/80 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-white/50 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentPage / totalPages) * 100)}% explored</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}