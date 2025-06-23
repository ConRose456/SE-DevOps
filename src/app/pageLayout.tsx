import React, { useContext, useEffect } from 'react';
import { AppLayout, SideNavigation, TopNavigation } from '@cloudscape-design/components';
import { HashRouter } from 'react-router-dom';
import PageRoute from './pageRouter';
import { InternalItemOrGroup } from '@cloudscape-design/components/button-dropdown/interfaces';
import { SignUpModal } from './components/signInComponent/signUpModal';
import { SignUpContext } from './controllers/SignUpController';

import "./globals.css";
import { SignInModal } from './components/signInComponent/signInModal';
import { AuthTokenStateContext, AuthTokenStateController } from './controllers/AuthTokenStateController';

export default function PageLayout() {
  const { authTokenStateController, userDisplayTextUseState } = useContext(AuthTokenStateContext);
  const { shouldSignUp, setShouldSignUp } = React.useContext(SignUpContext);

  const [isSignInVisible, setSignInVisible] = React.useState(false);

  // Ensures UX update on auth change and intital load
  useEffect(() => {
    (async () => {
      await AuthTokenStateController.isAuthorized()
        .then(({ isValid }) =>  {
          if (authTokenStateController.isAuthorized != isValid) {
              authTokenStateController.setIsAuthorised(isValid);
          }
        })
      userDisplayTextUseState.setUserDisplayText(
        authTokenStateController.isAuthorized 
          ? await AuthTokenStateController.getUserDisplayText()
          : ""
      ); 
    })()
  }, [authTokenStateController.isAuthorized]);

  // This updates UI on user auth token timeout
  useEffect(() => {
    const checkAuthed = () => {
      if (!AuthTokenStateController.isAuthorized()) {
        authTokenStateController.setIsAuthorised(false);
        userDisplayTextUseState.setUserDisplayText("");
        window.location.reload();
      }
    }

    // Calls checkAuth every hour
    const interval = setInterval(checkAuthed, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getLoginUtilsItems = (): InternalItemOrGroup[] => {
        if (authTokenStateController.isAuthorized) { // check if authed
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
                  AuthTokenStateController.signOut().then(() => {
                    userDisplayTextUseState.setUserDisplayText("");
                    authTokenStateController.setIsAuthorised(false);
                    window.history.replaceState({}, "", `${window.location.origin}`)
                    window.location.reload();
                  });
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
