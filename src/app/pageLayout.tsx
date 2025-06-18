import React from 'react';
import { AppLayout, SideNavigation, TopNavigation } from '@cloudscape-design/components';
import { GraphQlApiClient } from '../clients/GraphQlApiClient';
import { HashRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

import "./globals.css";

const graphqlClient = new GraphQlApiClient();

export default function PageLayout() {
  const [state, setState] = useState("");

  useEffect(() => {
    (async () => {
      graphqlClient.fetch(
        "query { hello { __typename id world { __typename text }}}",
        {}
      ).then((res) => setState(JSON.stringify(res, null, 2)));
    })()
  }, []);

  return (
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
                <p>{state}</p>
              </div>
            }
          />
        </HashRouter>
      </div>
  );
}
