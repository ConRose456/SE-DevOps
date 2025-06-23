import React from 'react';
import { GraphQlApiClient } from '@/clients/GraphQlApiClient';

import isAuthed from "../graphql/pages/auth/isAuthed.graphql";
import signOut from "../graphql/pages/auth/signout.graphql";
import userDisplayText from "../graphql/pages/auth/userDisplayText.graphql";

export const AuthTokenStateContext = React.createContext(
    {
      userDisplayTextUseState: {} as any,
      authTokenStateController: {} as any
    }
);

const graphqlClient = new GraphQlApiClient();

export class AuthTokenStateController {
    public static signOut = async () => {
        await graphqlClient.fetch(
            signOut
        ).then((res) => {
            if (!res.data?.signOut?.success) {
                console.log("[Sign Out Failed]");
            }
        })
    }

    public static isAuthorized = async () =>
        await graphqlClient.fetch(
            isAuthed
        ).then((res) => {
            if (res?.data) {
                return res.data.auth.validity;
            }
            return {isValid: false};
        }).catch((error) => console.log(error));

    // This will check if user is admin authed by server before rendering admin pages and fetching admin data
    public static isAdmin = async () => {
        const { isValid, isAdmin } = await this.isAuthorized();
        return isValid && isAdmin;
    }

    public static getUserDisplayText = async () => 
        await graphqlClient.fetch(
            userDisplayText
        ).then((res) => {
            if (res.data) {
                return res.data?.auth?.displayText?.text ?? "";
            }
            return "";
        }).catch((error) => console.log(error));
}