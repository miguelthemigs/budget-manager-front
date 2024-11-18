import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false); // Toggle dropdown on mobile

    const links = [
        { id: 1, path: "/", text: "Expense Tracker" },
        { id: 2, path: "/profile", text: "Profile" },     
        { id: 3, path: "/overview", text: "Overview" },     
        { id: 4, path: "/loan", text: "Loan Tracker" },
        { id: 5, path: "/login", text: "Login" },
        { id: 6, path: "/register", text: "Register" },
    ];

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
