import React, { useContext } from "react";
import { Pagination } from "@cloudscape-design/components";
import { PaginationContext } from "./bookListComponent/bookItemListView";

export const PaginateItemCardGrid = ({ pageCount }: { pageCount: number }) => {
    const { currentPage, setCurrentPage } = useContext(PaginationContext);

    return (
        <div className="pagination">
            <Pagination
                currentPageIndex={currentPage}
                pagesCount={pageCount}
                onChange={({ detail }) => {
                    setCurrentPage(detail.currentPageIndex)
                }}
            />
        </div>
    );
}