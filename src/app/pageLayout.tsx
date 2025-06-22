import React from 'react';
import { AppLayout, SideNavigation, TopNavigation } from '@cloudscape-design/components';
import { HashRouter } from 'react-router-dom';
import PageRoute from './pageRouter';

import "./globals.css";

export default function PageLayout() {
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
                <PageRoute />
              </div>
            }
          />
        </HashRouter>
      </div>
  );
}
