"use client"

import React from 'react';
import dynamic from 'next/dynamic';

import "./globals.css";


if (typeof window === "undefined") React.useLayoutEffect = () => { };

const PageLayoutComponent = dynamic(() => import('./pageLayout'), {ssr: false} );

export default function Home() {
  return (
    <main>
      <PageLayoutComponent />
    </main>
  );
}
