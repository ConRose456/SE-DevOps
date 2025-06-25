
import React, { useState } from "react";
import { Box, Button, Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import deleteUserMutation from "../../graphql/pages/auth/deleteUser.graphql";

const graphqlClient = new GraphQlApiClient();

export const DeleteUserModal = (
    {
        visible,
        setVisible,
        username
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void,
        username: string
    }
) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true)
        await graphqlClient.fetch(
            deleteUserMutation,
            { id: username }
        ).then((data) => {
            if (!data?.data?.deleteUser?.success) {
                alert(`Failed to Delete ${username}`);
                console.log("Delete Failed");
            }
            setVisible(false);
        })
        .catch(console.log)
        .finally(() => { 
            setLoading(false);
            window.location.reload();
        });
    }
    return (
        <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            header={
                <Header>
                    Confirm Delete
                </Header>
            }
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button onClick={() => setVisible(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={async () => handleDelete()}
                            loading={loading}
                        >
                            Delete
                        </Button>
                    </SpaceBetween>
                </Box>
            }
        >
            {`Are you sure you want to irreversibly delete ${username}`}
        </Modal>
    );
}