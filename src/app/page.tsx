"use client"

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import "./globals.css";
import { SignUpContext } from './controllers/SignUpController';
import { AuthTokenStateContext, AuthTokenStateController } from './controllers/AuthTokenStateController';


if (typeof window === "undefined") React.useLayoutEffect = () => { };

const PageLayoutComponent = dynamic(() => import('./pageLayout'), {ssr: false} );

export default function App() {
  const [isSignUpVisible, setSignUpVisible] = React.useState(false);

  const [userDisplayText, setUserDisplayText] = React.useState("");
  const [isAuthorized, setIsAuthorised] = React.useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        await AuthTokenStateController.isAuthorized()
          .then(({isValid}) =>  setIsAuthorised(isValid));
        setUserDisplayText(await AuthTokenStateController.getUserDisplayText());
      }
    })()
  }, []);

  return (
    <main>
      <AuthTokenStateContext.Provider value={{
        userDisplayTextUseState: {
          userDisplayText,
          setUserDisplayText
        },
        authTokenStateController: {
          isAuthorized,
          setIsAuthorised
        }
      }}>
        <SignUpContext.Provider value={{ shouldSignUp: isSignUpVisible, setShouldSignUp: setSignUpVisible }}>
          <PageLayoutComponent />
        </SignUpContext.Provider>
      </AuthTokenStateContext.Provider>
    </main>
  );
}
