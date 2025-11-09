import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  totalItems,
  pageSize = 10,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPrevPage = () => hasPrev && onPageChange(currentPage - 1);
  const goToNextPage = () => hasNext && onPageChange(currentPage + 1);

  // Generate page numbers to show
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
      {/* Results Information */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 border border-blue-100">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Showing{" "}
              <span className="font-bold text-blue-600">{startItem}</span> to{" "}
              <span className="font-bold text-blue-600">{endItem}</span> of{" "}
              <span className="font-bold text-blue-600">{totalItems}</span>{" "}
              results
            </span>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border border-purple-100">
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Page{" "}
                <span className="font-bold text-purple-600">{currentPage}</span>{" "}
                of{" "}
                <span className="font-bold text-purple-600">{totalPages}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* First Page Button */}
          <button
            onClick={goToFirstPage}
            disabled={!hasPrev}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              !hasPrev
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200"
            }`}
            title="First page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={goToPrevPage}
            disabled={!hasPrev}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
              !hasPrev
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {visiblePages.map((pageNum) => {
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-110"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 hover:scale-105"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={!hasNext}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
              !hasNext
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200"
            }`}
          >
            Next
          </button>

          {/* Last Page Button */}
          <button
            onClick={goToLastPage}
            disabled={!hasNext}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              !hasNext
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200"
            }`}
            title="Last page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
