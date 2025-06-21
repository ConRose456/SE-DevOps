import React, { createContext, useState } from "react";
import { 
    Box, 
    SpaceBetween, 
    Spinner 
} from "@cloudscape-design/components";
import { ItemCardGrid } from "./itemCardGrid";
import { PaginateItemCardGrid } from "../pagination";

export const PaginationContext = createContext({
    currentPage: 1,
    setCurrentPage: (value: any): any => value
});

export const BookItemListView = () => {
    const [pageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <PaginationContext.Provider value={{
            currentPage: currentPage,
            setCurrentPage: setCurrentPage
        }}>
            <SpaceBetween direction="vertical" size="xl">
                {
                    true // will be if not loading
                        ? ((3) > 0
                            ? <ItemCardGrid items={[1, 2, 3]}/>
                            : <Box className="empty_list" textAlign="center"><b>No Books in your collection</b></Box>)
                        : <Box className="empty_list" textAlign="center">
                            <Spinner size="large" />
                        </Box>
                }
                <Box textAlign="center">
                     <PaginateItemCardGrid pageCount={pageCount} />
                </Box>
            </SpaceBetween>
        </PaginationContext.Provider>
    );
}