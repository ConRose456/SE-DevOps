import React, { useEffect, useState } from "react";
import {
    Button,
    ContentLayout,
    Header,
    Input,
    Link,
    Popover,
} from "@cloudscape-design/components";
import { BookItemListView, getDefaultSearchValue, MAX_PAGE_SIZE } from "../components/bookListComponent/bookItemListView";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import { SearchDisplay } from "../components/searchDisplay";

import bookItemCardQuery from "../graphql/pages/home/booksItemsCards.graphql";
import { ContributeBookModal } from "../components/contributeBookComponent/bookContributionModal";
import { mustSignIn } from "../components/isSingedInComponent";

const graphqlClient = new GraphQlApiClient();

const SignInProtectedContirbution = mustSignIn(ContributeBookModal);

export const Home = () => {
    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    const [contributionModalVisible, setContributionModalVisible] = useState(false);

    useEffect(() => {
        setSearchInputValue(getDefaultSearchValue() ?? "");
        setSearchQueryValue(getDefaultSearchValue() ?? "");
        setDefaultsSet(true);
    }, []);

    const fetchBooks = async (
        titleText: string,
        cursor?: string | undefined
    ) => 
        await graphqlClient.fetch(
            bookItemCardQuery,
            {
                first: MAX_PAGE_SIZE,
                titleTextFilter: titleText,
                after: cursor
            }
        )
        .then((res) => res?.data?.home?.books ?? { total: 0, edges: [], hasNext: false })
        .catch((error) => console.log(error));

    return (
        <div>
            <ContentLayout
                defaultPadding
                headerVariant="high-contrast"
                header={
                    <Header
                        className='header'
                        variant="h1"
                        info={
                            <Popover
                                header="Global Book Library"
                                content="Welcome! You can view our global collection of books all from right here. Search or browse for you favourite books and add them to your collection."
                            >
                                <Link variant="info">Info</Link>
                            </Popover>
                        }
                        description="Search or browse for you favourite books and add them to your collection."
                        actions={
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setContributionModalVisible(true);
                                }}
                            >
                                Contribute Book
                            </Button>
                        }
                    >
                        Global Book Library
                    </Header>
                }
            >
                {
                contributionModalVisible 
                    ? <SignInProtectedContirbution visible={contributionModalVisible} setVisible={setContributionModalVisible} />
                    : <div />
                }
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
                    emptyMessage="Sorry we have no book in our library at this time." 
                    searchQueryValue={searchQueryValue}  
                    userOwned={false}                        
                />
            </ContentLayout>
        </div>
    )
}