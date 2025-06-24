import React, { useEffect } from "react";
import { useState } from "react";
import { BookItemListView, getDefaultSearchValue, MAX_PAGE_SIZE } from "../components/bookListComponent/bookItemListView";
import { ContentLayout, Header, Input, Link } from "@cloudscape-design/components";
import { SearchDisplay } from "../components/searchDisplay";
import getOwnedBooks from "../graphql/pages/userBooks/getUserBooks.graphql";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";

const graphqlClient = new GraphQlApiClient();

export const OwnedBooks = () => {
    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    // Clears URL args on page change
    useEffect(() => {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}#/owned_books`,
        );
    });

    useEffect(() => {
        setSearchInputValue(getDefaultSearchValue() ?? "");
        setSearchQueryValue(getDefaultSearchValue() ?? "");
        setDefaultsSet(true);
    }, []);

    const fetchBooks = async (
        titleText: string,
        cursor: string,
    ) => {
       return await graphqlClient.fetch(
            getOwnedBooks,
            {
                first: MAX_PAGE_SIZE,
                titleTextFilter: titleText,
                after: cursor
            }
        )
        .then((res) => 
            res.data?.ownedBooks?.books 
                ?? { total: 0, edges: [], hasNext: false}
        )
        .catch((error) => console.log(error));
    }

    return (
        <div>
            <ContentLayout
                defaultPadding
                headerVariant="high-contrast"
                header={
                    <Header
                        className='header'
                        variant="h1"
                        info={<Link variant="info">Info</Link>}
                        description="Search the books you own!"
                    >
                        Owned Books
                    </Header>
                }
            >
                <Input
                    onChange={({ detail }) => setSearchInputValue(detail.value)}
                    value={searchInputValue}
                    onKeyDown={({ detail }) => {
                        if (detail.key == "Enter") {
                            setSearchQueryValue(searchInputValue);
                        }
                    }}
                    placeholder="Search"
                    type="search"
                    className='search_input'
                />
                <SearchDisplay searchQueryValue={searchQueryValue} />
                <BookItemListView 
                    fetchDataCallback={fetchBooks}
                    defaultsSet={defaultsSet}
                    emptyMessage="Sorry you have no book in your library at this time." 
                    searchQueryValue={searchQueryValue}  
                    userOwned={true}
                />
            </ContentLayout>
        </div>
    );
}