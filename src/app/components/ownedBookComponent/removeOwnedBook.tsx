import { Box, Button, Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import React, { useState } from "react";

export const RemoveOwnedBookModal = (
    {
        visible, 
        setVisible,
        loading,
 //       setLoading
    }: {
        visible: boolean, 
        setVisible: (value: boolean) => void,
        loading: boolean,
        setLoading: (value: boolean) => void,
    }
) => {
    const [failed, setFailed] = useState(false);
setFailed(false);
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
                        {/* <Button
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                if (!failed) {
                                    setLoading(true);
                                    const response = await manageOwnedBook(id, "/api/remove_user_book");
                                    console.log(response)
                                    if (!response.success) {
                                        setFailed(true);
                                    }
                                    setLoading(false);
                                    window.location.reload();
                                } else {
                                    setFailed(false);
                                }
                                setVisible(false);
                            }}>{!failed ? "Remove" : "Exit"}</Button> */}
                    </SpaceBetween>
                </Box>
                }    
            >
                {failed ? "Failed to remove book from owned books." : `Are you sure you want to remove ${"tote"}?`}
            </Modal>
        </div>
    );
}