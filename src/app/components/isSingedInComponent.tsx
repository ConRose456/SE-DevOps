import React, { useContext, useEffect, useState } from "react";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { useNavigate } from "react-router-dom";
import { SignUpContext } from "../controllers/SignUpController";

export const mustSignIn = (WrappedComponent: any) => {
    return function SignInProtected(props: any) {
        const { setShouldSignUp } = useContext(SignUpContext);
        const navigate = useNavigate()
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            (async () => {
                await AuthTokenStateController.isAuthorized()
                    .then((res) => {
                        if (res?.isValid) {
                            setLoading(false);
                        } else { 
                            console.log("Foo");
                            setShouldSignUp(true);
                        }
                    });
            })();
        }, [navigate]);

        return !loading ? <WrappedComponent {...props} /> : undefined;
    };
};