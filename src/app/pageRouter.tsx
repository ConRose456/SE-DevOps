import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { OwnedBooks } from "./pages/ownedBooks";
import { mustSignIn } from "./components/isSingedInComponent";
import { withAdminAuth } from "./components/withAdminAuth";
import ManageUsers from "./pages/manageUsers";

const SignInProtectedOwnedBooks = mustSignIn(OwnedBooks);
const AdminProtectedManageUsers = withAdminAuth(ManageUsers);

export default function PageRoute() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/owned_books" element={<SignInProtectedOwnedBooks />}/>
            <Route path="/manage_users" element={<AdminProtectedManageUsers />}/>
        </Routes>
    );
};