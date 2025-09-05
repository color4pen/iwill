import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams = {}
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    // 最初のページ
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={createPageUrl(1)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
            ...
          </span>
        );
      }
    }

    // ページ番号
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={createPageUrl(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            i === currentPage
              ? 'z-10 bg-blue-600 border-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>
      );
    }

    // 最後のページ
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={createPageUrl(totalPages)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            前へ
          </Link>
        ) : (
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
            前へ
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            次へ
          </Link>
        ) : (
          <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
            次へ
          </span>
        )}
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            全 <span className="font-medium">{totalPages}</span> ページ中{' '}
            <span className="font-medium">{currentPage}</span> ページ目
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">前へ</span>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">前へ</span>
                <ChevronLeft className="h-5 w-5" />
              </span>
            )}
            
            {renderPageNumbers()}
            
            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">次へ</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">次へ</span>
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}