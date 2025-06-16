"use client"

import { AppLayout, SideNavigation, TopNavigation } from '@cloudscape-design/components';
import { GraphQlApiClient } from '@/clients/graphQlApiClient';
import { HashRouter } from 'react-router-dom';

import "./globals.css";

export default async function Home() {
  const graphqlClient = new GraphQlApiClient();

  const response = await graphqlClient.fetch(
    "query { hello { __typename id world { __typename text }}}",
    {}  
  );

  console.log(JSON.stringify(response));

  return (
    <main>
      <div>
        <HashRouter>
          <TopNavigation
            identity={{
              href: "#",
              title: "Book Wise"
            }}
          />
          <AppLayout
            toolsHide
            disableContentPaddings
            navigation={
              <SideNavigation 
                header={{
                  href: "#",
                  text: "Book Wise"
                }}
              
              />
            }
            content={
              <div>
                <p>{response}</p>
              </div>
            }
          />
        </HashRouter>
      </div>
    </main>
  );
}
