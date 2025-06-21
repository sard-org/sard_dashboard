import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiMenu, FiUsers, FiBookOpen, FiList,
    FiShoppingCart, FiUserCheck, FiLogOut
} from "react-icons/fi";
import "./sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            navigate("/auth");
        }
    };

    const getNavLinkClass = ({ isActive }) =>
        `menu-item ${isActive ? "active" : ""}`;

    return (
        <>
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="logo">Sard DASHBOARD</div>
                <ul className="menu">
                    <li>
                        <NavLink to="/" className={getNavLinkClass}>
                            <FiUsers />
                            <span>Users</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/authors" className={getNavLinkClass}>
                            <FiUserCheck />
                            <span>Authors</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/categories" className={getNavLinkClass}>
                            <FiList />
                            <span>Categories</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/books" className={getNavLinkClass}>
                            <FiBookOpen />
                            <span>Books</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/orders" className={getNavLinkClass}>
                            <FiShoppingCart />
                            <span>Orders</span>
                        </NavLink>
                    </li>

                    <li className="menu-item" style={{ backgroundColor: "red" }}>
                        <div onClick={handleLogout} style={{ color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FiLogOut />
                            <span>Logout</span>
                        </div>
                    </li>
                </ul>
            </div>

            <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
                <FiMenu />
            </button>
        </>
    );
};

export default Sidebar;