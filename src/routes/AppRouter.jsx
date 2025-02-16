import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Users from "../pages/Users";
import Authors from "../pages/Authors";
import Categories from "../pages/Categories";
import Book from "../pages/Book";
import Orders from "../pages/Orders";
import Auth from "../components/Auth/Auth";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Users />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/books" element={<Book />} />
                <Route path="/orders" element={<Orders />} />
            </Route>
            <Route path="*" element={<Auth />} />
        </Routes>
    );
};

export default AppRouter;
