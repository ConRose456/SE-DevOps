import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { OwnedBooks } from "./pages/ownedBooks";
import { mustSignIn } from "./components/isSingedInComponent";

const SignInProtectedOwnedBooks = mustSignIn(OwnedBooks);

export default function PageRoute() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/owned_books" element={<SignInProtectedOwnedBooks />}/>
        </Routes>
    );
};