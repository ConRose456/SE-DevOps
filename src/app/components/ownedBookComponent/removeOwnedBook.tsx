import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import { Box, Button, Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import React, { useState } from "react";
import removeBookMutation from "../../graphql/pages/userBooks/removeUserBook.graphql";

const graphqlClient = new GraphQlApiClient();

export const RemoveOwnedBookModal = (
    {
        id,
        title,
        visible,
        setVisible,
        loading,
        setLoading
    }: {
        id: string,
        title: string,
        visible: boolean,
        setVisible: (value: boolean) => void,
        loading: boolean,
        setLoading: (value: boolean) => void,
    }
) => {
    const [failed, setFailed] = useState(false);
    return (
        <div>
            <Modal
                visible={visible}
                onDismiss={() => {
                    setVisible(false);
                }}
                header={<Header>BookWise</Header>}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" disabled={loading} onClick={() => setVisible(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                                onClick={async () => {
                                    if (!failed) {
                                        setLoading(true);
                                        await AuthTokenStateController.isAuthorized()
                                            .then(async (res) => {
                                                if (res?.isValid) {
                                                    await graphqlClient.fetch(
                                                        removeBookMutation,
                                                        { id }
                                                    ).then((res) => {
                                                        if (!res?.data?.userOwned?.removeFromOwnedBooks?.success) {
                                                            setFailed(true);
                                                        }
                                                        window.location.reload();
                                                    })
                                                    .catch((error) => console.log(`[Error] - Oops something whent wrong: ${error}`))
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    } else {
                                        setFailed(false);
                                    }
                                    setVisible(false);
                                }}>{!failed ? "Remove" : "Exit"}</Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                {failed ? "Failed to remove book from owned books." : `Are you sure you want to remove ${title}?`}
            </Modal>
        </div>
    );
}