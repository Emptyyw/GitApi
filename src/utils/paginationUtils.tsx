import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}

const RenderPageNumbers: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const pageNumbers = [];
  const maxDisplayedPages = 5; // Максимальное количество отображаемых страниц

  if (totalPages <= maxDisplayedPages) {
    // Отображаем все страницы, если их не  много
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-number ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </span>,
      );
    }
  } else {
    //  сокращаем отображение с точками
    const leftOffset = Math.floor(maxDisplayedPages / 2);
    const rightOffset = Math.ceil(maxDisplayedPages / 2) - 1;

    // Отображаем первую страницу
    pageNumbers.push(
      <span
        key={1}
        onClick={() => handlePageChange(1)}
        className={`page-number ${1 === currentPage ? 'active' : ''}`}
      >
        {1}
      </span>,
    );

    if (currentPage - leftOffset > 2) {
      // Если currentPage находится  далеко от начала, добавляем "..." в начало
      pageNumbers.push(
        <span className="points" key="ellipsis-start">
          ...
        </span>,
      );
    }

    // Отображаем страницы вокруг текущей страницы
    for (
      let i = Math.max(2, currentPage - leftOffset);
      i <= Math.min(totalPages - 1, currentPage + rightOffset);
      i++
    ) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-number ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </span>,
      );
    }

    if (currentPage + rightOffset < totalPages - 1) {
      // Если currentPage находится достаточно далеко от конца добавляем "..." в конце
      pageNumbers.push(<span key="ellipsis-end">...</span>);
    }

    // Отображаем последнюю страницу
    pageNumbers.push(
      <span
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className={`page-number ${totalPages === currentPage ? 'active' : ''}`}
      >
        {totalPages}
      </span>,
    );
  }

  return <>{pageNumbers}</>;
};

export default RenderPageNumbers;
