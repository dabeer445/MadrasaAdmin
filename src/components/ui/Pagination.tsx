import { Pagination } from '@heroui/react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPages = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current <= 3) {
    for (let i = 2; i <= 5; i++) pages.push(i);
    pages.push('ellipsis');
  } else if (current >= total - 2) {
    pages.push('ellipsis');
    for (let i = total - 4; i < total; i++) pages.push(i);
  } else {
    pages.push('ellipsis');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('ellipsis');
  }
  pages.push(total);
  return pages;
};

export default function PaginationControl({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const pages = getPages(currentPage, totalPages);

  return (
    <Pagination>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={currentPage === 1} onPress={() => onPageChange(currentPage - 1)}>
            Previous
          </Pagination.Previous>
        </Pagination.Item>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <Pagination.Item key={`e${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === currentPage} onPress={() => onPageChange(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}

        <Pagination.Item>
          <Pagination.Next isDisabled={currentPage === totalPages} onPress={() => onPageChange(currentPage + 1)}>
            Next
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
