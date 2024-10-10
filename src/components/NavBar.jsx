import React, { useState } from "react";

import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false); // state to manage navbar visibility

    const links = [
        { id: 1, path: "/", text: "Expense Tracker" },
        { id: 2, path: "/profile", text: "Profile" },     
        { id: 3, path: "/demo", text: "Demo " },
    ];

    const toggleNavbar = () => {
        setIsOpen(!isOpen); // Toggle the navbar visibility
    };

    return (
        <div>
            <button onClick={toggleNavbar} className={styles.toggleButton}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </button>
            {isOpen && (
                <nav className={styles.navBar}>
                    <ul className={styles.menuNav}>
                        {links.map(link => (
                            <li key={link.id}>
                                <NavLink to={link.path}>
                                {link.text}
                                </NavLink>
                                    
                                
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default NavBar;
