import React, { useEffect, useState } from "react";
import { Box, Button, ContentLayout, Header, SpaceBetween, StatusIndicator, Table, TextFilter } from "@cloudscape-design/components";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import getAllUsersQuery from "../graphql/pages/auth/getAllUsers.graphql";
import { DeleteUserModal } from "../components/manageUsersComponent/deleteUserModal";
//import { DeleteUserModal } from "../common_components/manage_users_component/deleteUserModal";

const graphqlClient = new GraphQlApiClient();

export default function ManageUsers() {
    const [items, setItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [filterText, setFilterText] = useState("");

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Clears URL args on page change
    useEffect(() => {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}#/manage_users`,
        );
    });

    // Filters users by the text in search bar of table
    useEffect(() => { 
        if (filterText.length > 0) {
            const regex = new RegExp(filterText, 'i');
            setFilteredItems([...items].filter((item) => regex.test(item.username)))
        } else {
            setFilteredItems(items);
        }
    }, [filterText])

    // fetch user data on page load
    useEffect(() => {
        (async () => {
            await graphqlClient.fetch(
                getAllUsersQuery
            ).then((data) => {
                if (data?.data) {
                    const users = data?.data?.auth?.allUsers?.map((user: any) => ({
                        username: user.username,
                        isAdmin: user.isAdmin
                    }));
                    setItems(users);
                    setFilteredItems(users);
                }
            })
            .catch(console.log)
            .finally(() => setLoading(false))
        })()
    }, [])

    return (
        <div>
            <ContentLayout
                defaultPadding
                headerVariant="high-contrast"
                header={
                    <Header
                        className='header'
                        variant="h1"
                        description="Mange accounts for BookWise!"
                    >
                        Manage Users
                    </Header>
                }
            >
                {<DeleteUserModal visible={deleteModalVisible} setVisible={setDeleteModalVisible} username={selectedItems[0]?.username ?? ""} />}
                <div className="user_table">
                    <SpaceBetween direction='vertical' size='l'>
                        <Table
                            loading={loading}
                            header={
                                <Header
                                    actions={
                                        <Box float="right">
                                            <Button 
                                                variant="primary"
                                                disabled={selectedItems?.length === 0}
                                                onClick={() => {
                                                    setDeleteModalVisible(true);
                                                }}
                                            >
                                                Delete User
                                            </Button>
                                        </Box>
                                    }
                                >
                                    Users
                                </Header>
                            }
                            filter={
                                <TextFilter
                                    filteringPlaceholder="Find Users"
                                    filteringText={filterText}
                                    onChange={({detail}) => setFilterText(detail.filteringText)}
                                />
                            }
                            empty={
                                <Box
                                    margin={{ vertical: "xs" }}
                                    textAlign="center"
                                    color="inherit"
                                >
                                    <SpaceBetween size="m">
                                        <b>No Users Exist</b>
                                    </SpaceBetween>
                                </Box>
                            }
                            loadingText="Loading Users"
                            items={filteredItems}
                            selectionType="single"
                            selectedItems={selectedItems}
                            onSelectionChange={({detail}) => {
                                setSelectedItems(detail.selectedItems);
                            }}
                            columnDefinitions={[
                                {
                                    id: "username",
                                    header: "Username",
                                    cell: e => e.username,
                                    sortingField: "username"
                                },
                                {
                                    id: "is_admin",
                                    header: "Admin",
                                    cell: e => (
                                        <StatusIndicator
                                            type={e.isAdmin ? "success" : "error"}
                                        >
                                            {e.isAdmin ? "TRUE" : "FALSE"}
                                        </StatusIndicator>
                                    ),
                                    sortingField: "is_admin"
                                }
                            ]}
                        />
                    </SpaceBetween>
                </div>
            </ContentLayout>
        </div>
    );
}