import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
    FiMenu, FiUsers, FiBookOpen, FiList, 
    FiShoppingCart, FiUserCheck, FiChevronUp, 
    FiChevronDown, FiLogOut 
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
                            <FiUsers /> Users
                            {openMenu === "users" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "users" ? "open" : ""}`}>
                        <li><NavLink to="/users/add">Add User</NavLink></li>
                    </ul>

                    {/* Authors Menu */}
                    <li className={`menu-item ${openMenu === "authors" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("authors")}>
                            <FiUserCheck /> Authors
                            {openMenu === "authors" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "authors" ? "open" : ""}`}>
                        <li><NavLink to="/authors/add">Add Author</NavLink></li>
                    </ul>

                    {/* Categories Menu */}
                    <li className={`menu-item ${openMenu === "categories" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("categories")}>
                            <FiList /> Categories
                            {openMenu === "categories" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "categories" ? "open" : ""}`}>
                        <li><NavLink to="/categories/add">Add Category</NavLink></li>
                    </ul>

                    {/* Books Menu */}
                    <li className={`menu-item ${openMenu === "books" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("books")}>
                            <FiBookOpen /> Books
                            {openMenu === "books" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "books" ? "open" : ""}`}>
                        <li><NavLink to="/books/add">Add Book</NavLink></li>
                    </ul>

                    {/* Orders Menu */}
                    <li className={`menu-item ${openMenu === "orders" ? "active" : ""}`}>
                        <div onClick={() => toggleSubMenu("orders")}>
                            <FiShoppingCart /> Orders
                            {openMenu === "orders" ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                    </li>
                    <ul className={`sub-menu ${openMenu === "orders" ? "open" : ""}`}>
                        <li><NavLink to="/orders/add">Add Order</NavLink></li>
                    </ul>

                </ul>
            </div>

            {/* Toggle Sidebar Button */}
            <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
                <FiMenu />
            </button>
        </>
    );
};

export default Sidebar;
