import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FiMenu, FiUsers, FiBookOpen, FiList,
    FiShoppingCart, FiUserCheck, FiChevronUp,
    FiChevronDown
} from "react-icons/fi";
import "./sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState("");

    const toggleSubMenu = (menu) => {
        setOpenMenu(openMenu === menu ? "" : menu);
    };

    return (
        <>
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="logo">Sard DASHBOARD</div>
                <ul className="menu">
                    
                    {/* Users Menu */}
                    <li className={`menu-item ${openMenu === "users" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("users")}>
                            <FiUsers />
                            <span>Users</span>
                            {openMenu === "users" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "users" ? "open" : ""}`}>
                        <li><NavLink to="/">All Users</NavLink></li>
                    </ul>

                    {/* Authors Menu */}
                    <li className={`menu-item ${openMenu === "authors" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("authors")}>
                            <FiUserCheck />
                            <span>Authors</span>
                            {openMenu === "authors" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "authors" ? "open" : ""}`}>
                        <li><NavLink to="/authors">All Authors</NavLink></li>
                        <li><NavLink to="/authors/add">Add Author</NavLink></li>
                    </ul>

                    {/* Categories Menu */}
                    <li className={`menu-item ${openMenu === "categories" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("categories")}>
                            <FiList />
                            <span>Categories</span>
                            {openMenu === "categories" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "categories" ? "open" : ""}`}>
                        <li><NavLink to="/categories">All Categories</NavLink></li>
                        <li><NavLink to="/categories/add">Add Category</NavLink></li>
                    </ul>

                    {/* Books Menu */}
                    <li className={`menu-item ${openMenu === "books" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("books")}>
                            <FiBookOpen />
                            <span>Books</span>
                            {openMenu === "books" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "books" ? "open" : ""}`}>
                        <li><NavLink to="/books">All Books</NavLink></li>
                        <li><NavLink to="/books/add">Add Book</NavLink></li>
                    </ul>

                    {/* Orders Menu */}
                    <li className={`menu-item ${openMenu === "orders" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("orders")}>
                            <FiShoppingCart />
                            <span>Orders</span>
                            {openMenu === "orders" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "orders" ? "open" : ""}`}>
                        <li><NavLink to="/orders">All Orders</NavLink></li>
                    </ul>
                </ul>
            </div>

            <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
                <FiMenu />
            </button>
        </>
    );
};

export default Sidebar;
