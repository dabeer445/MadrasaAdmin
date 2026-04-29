import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage <= 3) {
      for (let i = 2; i <= 5; i++) pages.push(i);
      pages.push('ellipsis');
    } else if (currentPage >= totalPages - 2) {
      pages.push('ellipsis');
      for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
    } else {
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('ellipsis');
    }
    pages.push(totalPages);
    return pages;
  };

  const btnBase = 'p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className={btnBase}>
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={btnBase}>
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="px-2 text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={btnBase}>
        <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className={btnBase}>
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}
