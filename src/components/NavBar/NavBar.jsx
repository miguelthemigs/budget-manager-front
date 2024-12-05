import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import TokenManager from "../../services/TokenManager";
import { path } from "d3";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false); 
    const isAdmin = TokenManager.getUserRole() === "ADMIN";

    const links = [
        { id: 1, path: "/", text: "Expense Tracker" },
        { id: 2, path: "/profile", text: "Profile" },   
        { id: 4, path: "/Overview", text: "Overview"},
        { id: 5, path: "/demo", text: "Demo overview" },
    ];

    if (isAdmin) {
        links.push({ id: 3, path: "/dashboard", text: "Admin Dashboard" });
    }

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className={styles.header}>
            <button onClick={toggleNavbar} className={styles.toggleButton}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </button>
            <nav className={`${styles.navBar} ${isOpen ? styles.open : ""}`}>
                <ul className={styles.menuNav}>
                    {links.map(link => (
                        <li key={link.id}>
                            <NavLink to={link.path} activeClassName={styles.active}>
                                {link.text}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default NavBar;
