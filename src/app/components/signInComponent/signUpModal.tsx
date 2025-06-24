import { GraphQlApiClient } from "@/clients/GraphQlApiClient";
import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import signUpMutation from "../../graphql/pages/auth/signUp.graphql";
import { AuthTokenStateContext, AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";

const graphqlClient = new GraphQlApiClient();
const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordRegex = /^(?=.*\d)(?=.*[^\w\s])\S{7,}$/;

export const SignUpModal = (
    {
        visible,
        setVisible,
        setSignInVisible,
    }: {
        visible: boolean,
        setVisible: (value: boolean) => any,
        setSignInVisible: (value: boolean) => any,
    }
) => {
    const navigate = useNavigate();
    const { authTokenStateController } = useContext(AuthTokenStateContext);

    const [loading, setLoading] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [invalidInputs, setInvalidInputs] = useState<string[]>();

    const getUsernameErrorText = () => {
        if (invalidInputs?.includes("username")) {
            return "Your username must meet the conditions bellow.";
        } else if (invalidInputs?.includes("username_exists")) {
            return "This username already exists";
        }
        return "";
    }

    useEffect(() => {
        setEnteredUsername("");
        setPassword("");
        setConfirmPassword("");
        setInvalidInputs([]);
        setLoading(false);
    }, [visible]);

    const addInvalidInput = (invalidInput: string) => {
        invalidInputs?.push(invalidInput);
    }

    return (
        <Modal
            onDismiss={() => {
                if (!loading) {
                    setVisible(false);
                    navigate("/", { replace: true });
                }
            }}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button
                            variant="link"
                            disabled={loading}
                            onClick={() => {
                                setVisible(false);
                                navigate("/", { replace: true });
                            }}
                        >Cancel</Button>
                        <Button
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                const success = await signUp({
                                    username: enteredUsername,
                                    password,
                                    confirmPassword
                                }, addInvalidInput)
                                if (success) {
                                    setInvalidInputs([]);
                                    authTokenStateController.setIsAuthorised(
                                        AuthTokenStateController.isAuthorized()
                                    );
                                    window.location.reload();
                                    setLoading(false);
                                    setVisible(false);
                                } else {
                                    setLoading(false);
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </SpaceBetween>
                </Box>
            }
            header={
                <Header
                    info={
                        <Popover
                            header="Sign Up"
                            content="You can sign up and create an account here."
                        >
                            <Link>info</Link>
                        </Popover>
                    }
                >
                    Sign Up
                </Header>}
        >
            <SpaceBetween direction="vertical" size="m">
                <FormField
                    label="Username"
                    description="This username will be used when you log in to your new account."
                    errorText={getUsernameErrorText()}
                >
                    <Input value={enteredUsername} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter a password it must contain one digit 0-9 and a special character."
                    errorText={invalidInputs?.includes("password_invalid") ? "Your password must meet the requirements bellow." : ""}
                >
                    <Input type="password" value={password} onChange={({ detail }) => setPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    label="Confirm Password"
                    description="Enter your password again"
                    errorText={invalidInputs?.includes("password_not_equal") ? "This does not match the password you entered." : ""}
                >
                    <Input type="password" value={confirmPassword} onChange={({ detail }) => setConfirmPassword(detail.value)} placeholder="confirm password" />
                </FormField>
                <FormField
                    description={
                        <div>
                            If you have already made an account login here: {" "}
                            <Link
                                variant="primary"
                                fontSize="body-s"
                                onFollow={() => {
                                    if (!loading) {
                                        setSignInVisible(true);
                                        setVisible(false);
                                    }
                                }}
                            >
                                Login
                            </Link>
                        </div>
                    }
                />
            </SpaceBetween>
        </Modal>
    );
}

const signUp = async (
    input: { 
        username: string, 
        password: string, 
        confirmPassword: string 
    }, 
    addInvalidInputs: (input: string) => void
) => {
    if (validateInputs(input, addInvalidInputs)) {    
    const response = await graphqlClient.fetch(
        signUpMutation,
        {
            username: input.username,
            password: input.password
        }
    ).then((res) => {
        const response = res?.data;
        if (response) {
            const { signUp } = response;
            if (signUp?.alreadyExists) {
                addInvalidInputs("username_exists");
                return false;
            } else {
                return true;
            }
        }
    }).catch((error) => {
        console.log(`[FAILED TO SIGN UP] - ${error}`);
        return false;
    });
    return response;
    }
    return false;
}

const validateInputs = (
    input: { 
        username: string, 
        password: string, 
        confirmPassword: string 
    },
    addInvalidInputs: (input: string) => void
) => {
    const issues = [];
    if (!validateUsername(input.username)) {
        addInvalidInputs("username");
        issues.push("userame");
    }
    if (!validatePassword(input.password)) {
        addInvalidInputs("password_invalid");
        issues.push("password");
    }
    if (!isPasswordEqual(input.password, input.confirmPassword)) {
        addInvalidInputs("password_not_equal");
        issues.push("password");
    }
    return !issues.length ? true : false;
}

const validateUsername = (username: string): boolean => {
    return usernameRegex.test(username);
}

const validatePassword = (password: string): boolean => {
    return passwordRegex.test(password);
}

const isPasswordEqual = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
}