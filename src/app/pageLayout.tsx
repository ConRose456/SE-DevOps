import React from 'react';
import { AppLayout, SideNavigation, TopNavigation } from '@cloudscape-design/components';
import { HashRouter } from 'react-router-dom';
import PageRoute from './pageRouter';
import { InternalItemOrGroup } from '@cloudscape-design/components/button-dropdown/interfaces';
import { SignUpModal } from './components/signInComponent/signUpModal';
import { SignUpContext } from './controllers/SignUpController';

import "./globals.css";
import { SignInModal } from './components/signInComponent/signInModal';

export default function PageLayout() {
  const { shouldSignUp, setShouldSignUp } = React.useContext(SignUpContext);

  const [isSignInVisible, setSignInVisible] = React.useState(false);

  const getLoginUtilsItems = (): InternalItemOrGroup[] => {
        if (Math.random() == Math.random()) { // check if authed
            return [
                { itemType: "action", text: "Sign Out", id: "sign_out" },
            ];
        }
        return [
            { itemType: "action", text: "Sign In", id: "sign_in" },
            { itemType: "action", text: "Sign Up", id: "sign_up" }
        ];
    }

  return (
    <div>
      <HashRouter>
        <TopNavigation
          identity={{
            href: "#",
            title: "Book Wise"
          }}
          utilities={[
            {
              type: "menu-dropdown",
              iconName: "user-profile",
              text: "Test-User",
              items: getLoginUtilsItems(),
              onItemClick: ({ detail }) => {
                if (detail.id == "sign_in") {
                  setSignInVisible(true);
                } else if (detail.id == "sign_up") {
                  setShouldSignUp(true);
                } else if (detail.id == "sign_out") {
                  // userDisplayTextUseState.setUserDisplayText("");
                  // AuthTokenStateController.deleteAuthToken();
                  // authTokenStateController.setIsAuthorised(false);
                  window.history.replaceState({}, "", `${window.location.origin}`)
                  window.location.reload();
                }
              }
            },
          ]}
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
              items={[
                { type: 'link', text: `Home`, href: `#` },
                { type: 'link', text: `Owned Books`, href: `#/owned_books`},
              ]}
            />
          }
          content={
            <div>
              <SignInModal 
                visible={isSignInVisible} 
                setVisible={setSignInVisible} 
                setSignUpVisible={setShouldSignUp} 
              />
              <SignUpModal 
                visible={shouldSignUp} 
                setVisible={setShouldSignUp}
                setSignInVisible={setSignInVisible}              
              />
              <PageRoute />
            </div>
          }
        />
      </HashRouter>
    </div>
  );
}
