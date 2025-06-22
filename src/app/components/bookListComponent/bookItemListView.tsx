import React, { createContext, useEffect, useState } from "react";
import { 
    Box, 
    SpaceBetween,
    Spinner,
} from "@cloudscape-design/components";
import { ItemCardGrid } from "./itemCardGrid";
import { PaginateItemCardGrid } from "../pagination";

export const PaginationContext = createContext({
    currentPage: 1,
    setCurrentPage: (value: any): any => value
});

export const MAX_PAGE_SIZE = 2;

export const BookItemListView = ({
    searchQueryValue,
    emptyMessage,
    fetchDataCallback,
    defaultsSet,
    pageUrl
}: { 
    searchQueryValue: string,
    emptyMessage: string
    fetchDataCallback: (...args: any) => any
    defaultsSet: boolean,
    pageUrl?: string
 }) => {
    const [loading, setLoading] = useState(true);
    const [bookItems, setBookItems] = useState<any[]>();

    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setPageCount(getDefaultPageCount() ?? 1);
        setCurrentPage(getDefaultPageNumber() ?? 1);
    }, []);

    useEffect(() => {
        (async () => {
            if (defaultsSet) {
                setLoading(true);
                await fetchDataCallback(
                    searchQueryValue ?? "",
                    currentPage > 1 ? bookItems?.[bookItems?.length-1].cursor : undefined
                )
                    .then((res: any) => { 
                        const total = res.data.books.total;
                        setPageCount(Math.ceil(total / MAX_PAGE_SIZE));
                        setBookItems(res.data.books.edges);
                    })
                    .finally(() => {
                        savePageData(searchQueryValue, currentPage, pageCount, pageUrl)
                        setLoading(false)
                    });
            }
        })();
    }, [defaultsSet, currentPage, searchQueryValue])

    return (
        <PaginationContext.Provider value={{
            currentPage: currentPage,
            setCurrentPage: setCurrentPage
        }}>
            <SpaceBetween direction="vertical" size="xl">
                { !loading 
                    ? bookItems?.length 
                        ? <ItemCardGrid items={bookItems}/>
                        : <Box className="empty_list" textAlign="center"><b>{emptyMessage}</b></Box>
                    :  <Box textAlign="center">
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

export const getDefaultSearchValue = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("search") ?? undefined;
}

const getDefaultPageNumber = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("currentPage"));
}

const getDefaultPageCount = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("pageCount"));
}

const savePageData = (searchQueryValue: string, currentPage: number, pageCount: number, pageUrl?: string) => {
    if (typeof window !== "undefined") {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}${pageUrl ?? ""}/?${new URLSearchParams({
                search: searchQueryValue ?? "",
                currentPage: `${currentPage > 0 ? currentPage : 1}`,
                pageCount: `${pageCount > 0 ? pageCount : 1}`
            })}`,
        );
    }
};