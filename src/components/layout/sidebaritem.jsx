import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/router';
import styles from '../../styles/scss/components/layout/sidebaritem.module.scss';

function SidebarItem({ icon, text, submenu, href }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (submenu) {
            const isActive = submenu.some(item => router.asPath.includes(item.href));
            setIsOpen(isActive);
        }
    }, [router.asPath, submenu]);

    const toggleSubmenu = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        setIsOpen(!isOpen);
    };

    const isActive = (path) => router.asPath === path;

    return (
        <li className="sidebar-row group flex flex-col items-start py-2 px-3 my-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer">
            {href ? (
                <Link href={href} passHref className='w-full sidebar-item'>
                    <span className={`sidebar-item flex items-center w-full justify-between ${isActive(href) ? 'bg-red-700 text-white' : ''}`}>
                        <div className={`icon-container ${styles.iconStyle}`}>
                            {icon}
                        </div>
                        <span className="menu-text ml-3 flex-1">
                            {text}
                        </span>
                        {submenu && (
                            <IoIosArrowForward
                                className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                onClick={toggleSubmenu}
                            />
                        )}
                    </span>
                </Link>
            ) : (
                <span className="w-full sidebar-item">
                    <span className={`sidebar-item flex items-center w-full justify-between ${isActive(href) ? 'bg-red-700 text-white' : ''}`}>
                        <div className={`icon-container ${styles.iconStyle}`}>
                            {icon}
                        </div>
                        <span className="menu-text ml-3 flex-1">
                            {text}
                        </span>
                        {submenu && (
                            <IoIosArrowForward
                                className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                onClick={toggleSubmenu}
                            />
                        )}
                    </span>
                </span>
            )}
            {isOpen && submenu && (
                <ul className="aside-item-child w-full pl-6 pt-4">
                    {submenu.map((item, index) => (
                        <li key={index} className={`sidebar-item py-1 flex items-center ${isActive(item.href) ? 'bg-red-700 text-white' : ''}`}>
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
