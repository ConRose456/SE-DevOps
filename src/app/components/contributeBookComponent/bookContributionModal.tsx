import React, { useEffect, useState } from "react";
import { Box, Button, FormField, Header, Input, Modal, SpaceBetween, Textarea } from "@cloudscape-design/components";
import { validateBookInputs } from "@/app/helpers/validateBookInputs";
import { ErrorContributeBookModal } from "./contributeErrorModal";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import contributeBook from "../../graphql/pages/home/contributeBook.graphql";

const graphqlClient = new GraphQlApiClient();

export const ContributeBookModal = (
    {
        visible,
        setVisible,
        isEdit,
        editData
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void,
        isEdit?: boolean
        editData?: {
            isbn: string,
            title: string,
            author: string,
            description: string
        }
    }
) => {
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isbn, setIsbn] = useState("");
    const [title, setTitle] = useState("");
    const [authors, setAuthors] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const [invalidInputs, setInvalidInputs] = useState<string[]>([]);

    useEffect(() => {
        if (isEdit) {
            setIsbn(editData?.isbn ?? "");
            setTitle(editData?.title ?? "");
            setAuthors(editData?.author ?? "");
            setDescription(editData?.description ?? "");
        }
    }, []);

    // Ensure user is Authed
    useEffect(() => {
        if (!isEdit) {
            setIsbn("");
            setTitle("");
            setAuthors("");
            setDescription("");
            setInvalidInputs([]);
        }
    }, [visible]);

    const onReponse = (response: any) => {
        const contributeBookResponse = response ?? { alreadyExists: false, success: false };

        if (contributeBookResponse.success) {
            window.location.reload();
            setVisible(false);
        } else {
            setErrorMessage(response.message ?? "Uknown error");
            setErrorModalVisible(true);
        }
    }

    return (
        <div>
            <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                header={
                    <Header>
                        {isEdit ? "Edit your book" : "Contribute a Book"}
                    </Header>
                }
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setVisible(false)}>Cancel</Button>
                            <Button 
                                loading={loading}
                                variant="primary"
                                onClick={async() => {
                                    setLoading(true);

                                    const bookData = {
                                        id: isbn,
                                        title,
                                        authors,
                                        description
                                    }

                                    setInvalidInputs(validateBookInputs(bookData));
                                    console.log(JSON.stringify(invalidInputs));
                                    if (invalidInputs?.length) {
                                        await graphqlClient.fetch(
                                            contributeBook,
                                            { ...bookData, authors: authors.split(",") }
                                        ).then((res) => { 
                                            const response = res?.data?.contributeBook;
                                            console.log(JSON.stringify(response, null, 2));
                                            onReponse({
                                                ...response,
                                                message: "Failed to contribute book."
                                            });
                                        });
                                    } else {
                                        setLoading(false);
                                    }
                                    
                                    setLoading(false);
                                }}
                            >
                                Submit
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <ErrorContributeBookModal
                    visible={errorModalVisible}
                    setVisible={setErrorModalVisible}
                    message={errorMessage}
                />
                <SpaceBetween direction="vertical" size="l">
                    <FormField
                        label="ISBN"
                        description="Enter the Books unique ISBN number."
                        errorText={invalidInputs?.includes("id") ? "You must enter an ISBN." : ""}
                    >
                        <Input
                            placeholder="Enter ISBN"
                            value={isbn}
                            disabled={isEdit}
                            onChange={({ detail }) => setIsbn(detail.value.replace(" ", ""))}
                        />
                    </FormField>
                    <FormField
                        label="Title"
                        description="Enter the books title."
                        errorText={invalidInputs?.includes("title") ? "You must enter a title." : ""}
                    >
                        <Input
                            placeholder="Enter book title"
                            value={title}
                            onChange={({ detail }) => setTitle(detail.value)}
                        />
                    </FormField>
                    <FormField
                        label="Authors"
                        description="Enter the authors or contributers of the book. (Seperate with (,))"
                        errorText={invalidInputs?.includes("authors") ? "You must enter an author." : ""}
                    >
                        <Input
                            placeholder="Enter author's name"
                            value={authors}
                            onChange={({ detail }) => setAuthors(detail.value)}
                        />
                    </FormField>
                    <FormField
                        label="Description"
                        description="Enter a description of the book or the books blurb"
                        errorText={invalidInputs?.includes("description") ? "You must enter a description." : ""}
                    >
                        <Textarea
                            onChange={({ detail }) => setDescription(detail.value)}
                            value={description}
                            placeholder="Book description..."
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </div>
    );
}