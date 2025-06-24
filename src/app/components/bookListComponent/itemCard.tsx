import React from "react";
import {
    Box,
    Button,
    Container,
    Link,
    SpaceBetween
} from "@cloudscape-design/components";
import Image from "next/image";
import { UserOwnsBookModal } from "../ownedBookComponent/userOwnsBookModal";
import { AuthTokenStateController } from "../../controllers/AuthTokenStateController";
import { SignUpContext } from "../../controllers/SignUpController";
import { GraphQlApiClient } from "../../../clients/GraphQlApiClient";

import addUserBook from "../../graphql/pages/userBooks/addUserBook.graphql";
import { RemoveOwnedBookModal } from "../ownedBookComponent/removeOwnedBook";
import { ContributeBookModal } from "../contributeBookComponent/bookContributionModal";

const DEFAULT_BOOK_IMAGE_PATH = "/images/bookImage.jpg"

const graphqlClient = new GraphQlApiClient();

export const ItemCard = ({
    item,
    userOwned
  }: {
    item: any;
    userOwned?: boolean
}) => {
    const node = item.node;
    const { setShouldSignUp } = React.useContext(SignUpContext);

    const [contributionModalVisible, setContributionModalVisible] = React.useState(false);

    const [removeModalVisible, setRemoveModalVisible] = React.useState(false);
    const [addModalVisible, setAddModalVisible] = React.useState(false);
    const [addModalMessage, setAddModalMessage] = React.useState("");
    const [bookAdded, setBookAdded] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    return (
        <div>
            <Container
                className="item_card"
                media={{
                    content: (
                        <Image
                            src={DEFAULT_BOOK_IMAGE_PATH}
                            alt="book image"
                            height={400}
                            width={100}
                        />
                    ),
                    position: "side",
                    width: "33%",
                }}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="s">
                            <Button
                                variant="normal"
                                onClick={() => {
                                    setContributionModalVisible(true)
                                }}
                            >
                                Edit
                            </Button>
                            {!userOwned ?
                                <Button
                                    loading={loading}
                                    disabled={bookAdded}
                                    variant={"primary"}
                                    onClick={async () => {
                                        setLoading(true);
                                        await AuthTokenStateController.isAuthorized()
                                            .then(async (res) => {
                                                if (!res?.isValid) {
                                                    setShouldSignUp(true);
                                                } else {
                                                    await graphqlClient.fetch(
                                                        addUserBook,
                                                        { addToOwnedBooksId: node.id }
                                                    ).then((res) => {
                                                        if (res?.data?.userOwned?.addToOwnedBooks?.success) {
                                                            setAddModalMessage("Successfully Added book!");
                                                            setBookAdded(true)
                                                        } else {
                                                            setAddModalMessage("Something went wrong, failed to add book to yout collect.");
                                                        }
                                                    })
                                                    .catch((error) => console.log(`[Error] - Oops something whent wrong: ${error}`))
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        setLoading(false);
                                    }}
                                >{bookAdded ? "Book Added" : "Add to Owned"}</Button>
                                : <Button
                                    variant="primary"
                                    onClick={async () => {
                                        setRemoveModalVisible(true);
                                    }}
                                >Remove Book</Button>
                            }
                        </SpaceBetween>
                    </Box>
                }
            >
                <ContributeBookModal 
                    visible={contributionModalVisible} 
                    setVisible={setContributionModalVisible} 
                    isEdit={true}
                    editData={{ ...node, authors: node?.authors?.join(", ") ?? "" }}
                />
                <UserOwnsBookModal
                    visible={addModalVisible}
                    setVisible={setAddModalVisible}
                    message={addModalMessage}
                />
                <RemoveOwnedBookModal
                    id={node.id}
                    title={node.title}
                    visible={removeModalVisible}
                    setVisible={setRemoveModalVisible}
                    loading={loading}
                    setLoading={setLoading}
                />
                <SpaceBetween direction="vertical" size="xxs">
                    <SpaceBetween direction="vertical" size="xxs">
                        <Box variant="h2">
                            <Link fontSize="heading-m" href="#">
                                {node.title}
                            </Link>
                        </Box>
                        <Box variant="p">Author: {joinWithOptionalTruncation(node.authors, 10)}</Box>
                    </SpaceBetween>
                    <Box variant="small" >
                        {node.description.slice(0, 130) + '...'}
                    </Box>
                </SpaceBetween>
            </Container>
        </div>
    );
}

function joinWithOptionalTruncation(items: string[], truncateLastTo: number = 3): string {
  if (items.length === 0) return "";

  const lastOriginal = items[items.length - 1];
  const truncatedLast = lastOriginal.slice(0, truncateLastTo);

  const shortened = truncatedLast.length < lastOriginal.length;
  const resultArray = [...items.slice(0, -1), truncatedLast];
  const result = resultArray.join(", ") + (shortened ? "..." : "");

  return result;
}