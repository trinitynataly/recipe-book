import React, { useState } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import styles from '../../styles/scss/components/layout/sidebaritem.module.scss';


function SidebarItem({ icon, text, active, submenu, href }) {
    const [isOpen, setIsOpen] = useState(true);

    // Function to toggle submenu visibility
    const toggleSubmenu = () => {
        if (submenu) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <li className={`sidebar-row group flex flex-col items-start py-2 px-3 my-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer ${active ? 'bg-red-900' : ''}`}
            onClick={(e) => {
                e.stopPropagation(); // Prevent submenu toggle from bubbling up
            }}>
            {/* Use Link only if href is provided and there is no submenu */}
            {!submenu && href ? (
                <Link href={href} passHref>
                    <span className="sidebar-item flex items-center w-full justify-between">
                        <div className={`icon-container ${styles.iconStyle}`}>
                            {icon}
                        </div>
                        <span className="menu-text ml-3 flex-1">
                            {text}
                        </span>
                    </span>
                </Link>
            ) : (
                <div className="sidebar-item flex items-center w-full justify-between" onClick={toggleSubmenu}>
                    <div className={`icon-container ${styles.iconStyle}`}>
                        {icon}
                    </div>
                    <span className="menu-text ml-3 flex-1">
                        {text}
                    </span>
                    {submenu && (
                        <IoIosArrowForward className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                    )}
                </div>
            )}
            {isOpen && submenu && (
                <ul className="aside-item-child w-full pl-6 pt-4">
                    {submenu.map((item, index) => (
                        <li key={index} className="sidebar-item py-1 flex items-center">
                            <Link href={item.href} passHref>
                                <span className="flex items-center">
                                    <div className="icon-container" style={{ width: '18px', height: '18px' }}>
                                        {item.icon}
                                    </div>
                                    <span className={`ml-2 hover:text-secondary cursor-pointer block ${styles.submenuItem}`}>
                                        {item.text}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

export default SidebarItem;
