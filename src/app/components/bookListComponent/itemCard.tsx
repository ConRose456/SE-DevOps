import React from "react";
import { 
    Box, 
    Button, 
    Container, 
    Link, 
    SpaceBetween 
} from "@cloudscape-design/components";
import Image from "next/image";

const DEFAULT_BOOK_IMAGE_PATH = "/images/bookImage.jpg"

export const ItemCard = ({ item }: { item: any }) => {
    console.log(item);
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
                                    console.log("edit")
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant={"primary"}
                                onClick={() => {console.log("Add to owned")}}
                                >Add to Owned
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <SpaceBetween direction="vertical" size="xxs">
                    <SpaceBetween direction="vertical" size="xxs">
                        <Box variant="h2">
                            <Link fontSize="heading-m" href="#">
                                {"Harry Potter"}
                            </Link>
                        </Box>
                        <Box variant="p">Author: {"JK Rowling"}</Box>
                    </SpaceBetween>
                    <Box variant="small" >
                        {("Test description").slice(0, 130) + '...'}
                    </Box>
                </SpaceBetween>
            </Container>
        </div>
    );
}