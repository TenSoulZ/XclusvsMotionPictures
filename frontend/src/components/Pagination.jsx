import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) return null;

    let items = [];
    
    // Always show first page
    items.push(
        <BSPagination.Item 
            key={1} 
            active={currentPage === 1}
            onClick={() => onPageChange(1)}
            className="mx-1"
        >
            1
        </BSPagination.Item>
    );

    if (currentPage > 3) {
        items.push(<BSPagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // Show pages around current page
    for (let number = Math.max(2, currentPage - 1); number <= Math.min(totalPages - 1, currentPage + 1); number++) {
        items.push(
            <BSPagination.Item 
                key={number} 
                active={number === currentPage}
                onClick={() => onPageChange(number)}
                className="mx-1"
            >
                {number}
            </BSPagination.Item>
        );
    }

    if (currentPage < totalPages - 2) {
        items.push(<BSPagination.Ellipsis key="end-ellipsis" disabled />);
    }

    // Always show last page
    if (totalPages > 1) {
        items.push(
            <BSPagination.Item 
                key={totalPages} 
                active={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                className="mx-1"
            >
                {totalPages}
            </BSPagination.Item>
        );
    }

    return (
        <BSPagination className="justify-content-center mt-5 mb-0 custom-pagination">
            <BSPagination.Prev 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="mx-1"
            />
            {items}
            <BSPagination.Next 
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="mx-1"
            />
        </BSPagination>
    );
};

export default Pagination;
