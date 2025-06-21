import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Users from "../pages/Users";
import UpdateUser from "../components/Users/UpdateUser";
import Authors from "../pages/Authors";
import AddAuthor from "../components/Authors/AddAuthor";
import UpdateAuthor from "../components/Authors/UpdateAuthor";
import Categories from "../pages/Categories";
import AddCategory from "../components/Categories/AddCategory";
import UpdateCategory from "../components/Categories/UpdateCategory";
import Books from "../pages/Book";
import AddBook from "../components/Books/AddBook";
import UpdateBook from "../components/Books/UpdateBook";
import Orders from "../pages/Orders";
import Auth from "../components/Auth/Auth";
import UserDetails from "../components/Users/UserDetails";
import AuthorDetails from "../components/Authors/AuthorDetails";
import CategoryDetails from "../components/Categories/CategoryDetails";
import BookDetails from "../components/Books/BookDetails";
import OrderDetails from "../components/Orders/OrderDetails";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Users />} />
                <Route path="/users/:userId/update" element={<UpdateUser />} />
                <Route path="/users/:userId/view" element={<UserDetails />} />

                <Route path="/authors" element={<Authors />} />
                <Route path="/authors/add" element={<AddAuthor />} />
                <Route path="/authors/update/:id" element={<UpdateAuthor />} />
                <Route path="/authors/:id" element={<AuthorDetails />} />

                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/add" element={<AddCategory />} />
                <Route path="/categories/update/:id" element={<UpdateCategory />} />
                <Route path="/categories/:id" element={<CategoryDetails />} />

                <Route path="/books" element={<Books />} />
                <Route path="/books/add" element={<AddBook />} />
                <Route path="/books/update/:id" element={<UpdateBook />} />
                <Route path="/books/:id" element={<BookDetails />} />

                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
            </Route>

            <Route path="*" element={<Auth />} />
        </Routes>
    );
};

export default AppRouter;