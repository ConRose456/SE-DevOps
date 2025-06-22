"use client"

import React from 'react';
import dynamic from 'next/dynamic';

import "./globals.css";
import { SignUpContext } from './controllers/SignUpController';


if (typeof window === "undefined") React.useLayoutEffect = () => { };

const PageLayoutComponent = dynamic(() => import('./pageLayout'), {ssr: false} );

export default function App() {
  const [isSignUpVisible, setSignUpVisible] = React.useState(false);

  return (
    <main>
      <SignUpContext.Provider value={{ shouldSignUp: isSignUpVisible, setShouldSignUp: setSignUpVisible }}>
        <PageLayoutComponent />
      </SignUpContext.Provider>
    </main>
  );
}
