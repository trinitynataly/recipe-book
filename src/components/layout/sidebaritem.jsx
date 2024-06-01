import React, { Fragment } from 'react';
import styles from '../../styles/scss/components/layout/sidebaritem.module.scss';
import {IoIosArrowForward} from "react-icons/io";

const SidebarItem = ({ icon, text, submenu, isOpen, toggleSubmenu }) => {
    return (
        <span className="sidebar-item flex items-center w-full justify-between">
            <span className={`icon-container ${styles.iconStyle}`}>
                {icon}
            </span>
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
    )
};
export default SidebarItem;
