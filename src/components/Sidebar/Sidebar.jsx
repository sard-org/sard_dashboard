import React, { useState } from "react";
import { Link } from "react-router-dom";
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
                        <Link to="/" onClick={() => toggleSubMenu("users")}>
                            <FiUsers /> Users
                            {openMenu === "users" ? <FiChevronUp /> : <FiChevronDown />}
                        </Link>
                    </li>
                    <ul className={`sub-menu ${openMenu === "users" ? "open" : ""}`}>
                        <li><Link to="/users/add">Add User</Link></li>
                    </ul>

                    {/* Authors Menu */}
                    <li className={`menu-item ${openMenu === "authors" ? "active" : ""}`}>
                        <Link to="/authors" onClick={() => toggleSubMenu("authors")}>
                            <FiUserCheck /> Authors
                            {openMenu === "authors" ? <FiChevronUp /> : <FiChevronDown />}
                        </Link>
                    </li>
                    <ul className={`sub-menu ${openMenu === "authors" ? "open" : ""}`}>
                        <li><Link to="/authors/add">Add Author</Link></li>
                    </ul>

                    {/* Categories Menu */}
                    <li className={`menu-item ${openMenu === "categories" ? "active" : ""}`}>
                        <Link to="/categories" onClick={() => toggleSubMenu("categories")}>
                            <FiList /> Categories
                            {openMenu === "categories" ? <FiChevronUp /> : <FiChevronDown />}
                        </Link>
                    </li>
                    <ul className={`sub-menu ${openMenu === "categories" ? "open" : ""}`}>
                        <li><Link to="/categories/add">Add Category</Link></li>
                    </ul>

                    {/* Books Menu */}
                    <li className={`menu-item ${openMenu === "books" ? "active" : ""}`}>
                        <Link to="/books" onClick={() => toggleSubMenu("books")}>
                            <FiBookOpen /> Books
                            {openMenu === "books" ? <FiChevronUp /> : <FiChevronDown />}
                        </Link>
                    </li>
                    <ul className={`sub-menu ${openMenu === "books" ? "open" : ""}`}>
                        <li><Link to="/books/add">Add Book</Link></li>
                    </ul>

                    {/* Orders Menu */}
                    <li className={`menu-item ${openMenu === "orders" ? "active" : ""}`}>
                        <Link to="/orders" onClick={() => toggleSubMenu("orders")}>
                            <FiShoppingCart /> Orders
                            {openMenu === "orders" ? <FiChevronUp /> : <FiChevronDown />}
                        </Link>
                    </li>
                    <ul className={`sub-menu ${openMenu === "orders" ? "open" : ""}`}>
                        <li><Link to="/orders/add">Add Order</Link></li>
                    </ul>

                </ul>

            </div>

            {/* Toggle Sidebar Button */}
            <button className="menu-button" onClick={() => setIsOpen(true)}>
                <FiMenu />
            </button>
        </>
    );
};

export default Sidebar;
