import { AuthTokenStateContext, AuthTokenStateController } from "../../controllers/AuthTokenStateController";
import { 
    Box, 
    Button, 
    FormField, 
    Header, 
    Input, 
    Link, 
    Modal, 
    Popover, 
    SpaceBetween
} from "@cloudscape-design/components";
import React, { useContext, useState } from "react"
import { useEffect } from "react";
import { GraphQlApiClient } from "@/clients/GraphQlApiClient";

import signInMutation from "../../graphql/pages/auth/signIn.graphql";
const graphqlClient = new GraphQlApiClient();

export const SignInModal = (
    {
        visible,
        setVisible,
        setSignUpVisible,
    }: {
        visible: boolean,
        setVisible: (value: boolean) => any,
        setSignUpVisible: (value: boolean) => any,
    }
) => {
    const { authTokenStateController } = useContext(AuthTokenStateContext);

    const [loading, setLoading] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [invalidInputs, setInvalidInputs] = useState(false);

    useEffect(() => {
        setEnteredUsername("");
        setEnteredPassword("");
        setInvalidInputs(false);
        setLoading(false);
    }, [visible]);

    return (
        <Modal
            onDismiss={() => {
                if (!loading) {
                    setVisible(false)
                }
            }}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link" disabled={loading} onClick={() => setVisible(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                await graphqlClient.fetch(
                                    signInMutation,
                                    {
                                        username: enteredUsername,
                                        password: enteredPassword
                                    }
                                ).then(async (res) => {
                                    if (res?.errors) {
                                        setInvalidInputs(true);
                                    } else {
                                        await AuthTokenStateController.isAuthorized()
                                        .then((data) => 
                                            authTokenStateController.setIsAuthorised(data?.isValid)
                                        )
                                         setVisible(false);
                                        window.location.reload()
                                    }
                                })
                                setLoading(false);
                            }}>Login</Button>
                    </SpaceBetween>
                </Box>
            }
            header={
                <Header
                    info={
                        <Popover
                            header="Login"
                            content="You can login to your account here."
                        >
                            <Link>info</Link>
                        </Popover>
                    }
                >
                    Login
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="m">
                <FormField
                    label="Username"
                    description="The username you created your account with."
                >
                    <Input value={enteredUsername} invalid={invalidInputs} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter your password"
                    errorText={invalidInputs ? "Incorrect Username or Password." : ""}
                >
                    <Input type="password" value={enteredPassword} onChange={({ detail }) => setEnteredPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    description={
                        <div>
                            {"If you don't have an account create on here: "}
                            <Link
                                variant="primary"
                                fontSize="body-s"
                                onFollow={() => {
                                    if (!loading) {
                                        setSignUpVisible(true);
                                        setVisible(false);
                                    }
                                }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    }
                />
            </SpaceBetween>
        </Modal>
    );
}