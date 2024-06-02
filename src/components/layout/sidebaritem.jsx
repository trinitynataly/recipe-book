/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A sidebar item component for the application layout displaying icon and text of the menu item.
*/

// Import the Fragment component from React for grouping elements
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the IoIosArrowForward icon from React Icons for the submenu arrow
import {IoIosArrowForward} from "react-icons/io";
// Import the styles module for the sidebar item
import styles from '../../styles/scss/components/layout/sidebaritem.module.scss';

/**
 * SidebarItem component to display the icon and text of the menu item.
 * SidebarItem component properties:
 * @param icon: the icon component for the menu item
 * @param text: the text for the menu item
 * @param submenu: the flag to indicate submenu items
 * @param isOpen: the flag to indicate open submenu
 * @param toggleSubmenu: the function to toggle submenu visibility
 */
const SidebarItem = ({ icon, text, submenu, isOpen, toggleSubmenu }) => {
  // Return the sidebar item with icon and text
  return (
    <Fragment>
      {/* Sidebar item with icon and text */}
      <span className="sidebar-item flex items-center w-full justify-between">
        {/* Icon container with icon */}
        <span className={`icon-container ${styles.iconStyle}`}>
          {icon}
        </span>
        {/* Text container with text */}
        <span className="menu-text ml-3 flex-1">
          {text}
        </span>
        {/* Submenu arrow for submenu items */}
        {submenu && (
          <IoIosArrowForward
            className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            onClick={toggleSubmenu}
          />
        )}
      </span>
    </Fragment>
    )
};

// Validate the SidebarItem component properties
SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired, // Icon component
  text: PropTypes.string.isRequired, // Text for the menu item
  submenu: PropTypes.bool, // Flag to indicate submenu items
  isOpen: PropTypes.bool, // Flag to indicate open submenu
  toggleSubmenu: PropTypes.func, // Function to toggle submenu visibility
};

// Export the SidebarItem component
export default SidebarItem;
