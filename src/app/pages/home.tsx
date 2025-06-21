import { Button, ContentLayout, Header, Link, Popover } from "@cloudscape-design/components";
import React from "react";

export const Home = () => {
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
                                    console.log("Open Contribution Modal");
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

            </ContentLayout>
        </div>
    )
}