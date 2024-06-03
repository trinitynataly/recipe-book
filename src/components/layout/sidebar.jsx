/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A sidebar component for displaying the application navigation menu.
*/

// Import the Fragment, useState and useEffect hooks from React
import { Fragment, useState, useEffect } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the LuMenuSquare icon from React Icons
import { LuMenuSquare } from 'react-icons/lu';
// Import the Logo component from the public folder
import Logo from '../../../public/recipe_book_logo.svg';
// Import the SidebarSection component for the sidebar menu items
import SidebarSection from './sidebarsection';

/**
 * Sidebar component to display the application navigation menu.
 * Sidebar component properties:
 * @param {array} items - the list of menu items
 * @param {boolean} isMobile - the flag to indicate mobile view
 * @returns {JSX.Element} - the application navigation menu
 */ 
function Sidebar({ items, isMobile }) {
  // Define the state for the menu visibility
  const [menuVisible, setMenuVisible] = useState(false);

  // Hook to handle mobile view changes
  useEffect(() => {
    // Set the menu visibility to false when switching to desktop view
    setMenuVisible(!isMobile);
  }, [isMobile]);

  // Function to toggle the sidebar menu visibility
  function toggleSidebar() {
    // Check if the view is mobile
    if (isMobile) {
      // Toggle the menu visibility if the view is mobile
      setMenuVisible(!menuVisible);
    }
  }

  // Return the sidebar menu
  return (
    <Fragment>
      {/* Sidebar menu block */}
      <aside id="sidebar" className={`bg-sidebarBg dark:bg-darkSidebarBg text-sidebarText ${isMobile ? 'relative h-16' : 'fixed top-0 left-0 w-80 h-screen overflow-y-auto'}`}>
        {/* Navigation menu */}
        <nav className={`${isMobile ? 'flex-row justify-between items-center' : 'flex-col h-full justify-between items-center'}`}>
          {/* Logo block */}
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Logo image with link to home */}
            <Link href="/" passHref>
              <Logo className="w-48" />
            </Link>
            {/* Menu toggle mobile button */}
            <button onClick={toggleSidebar} className={`z-20 ${isMobile ? '' : 'hidden'}`}>
              <LuMenuSquare style={{ fontSize: '2em' }} />
            </button>
          </div>
          {/* Sidebar menu items */}
          <ul className={`bg-sidebarBg dark:bg-darkSidebarBg flex-1 px-3 ${isMobile ? (menuVisible ? 'block z-50 absolute w-full' : 'hidden') : 'block'}`}>
            {items.map((item, index) => ( // Map through the list of menu items
              <SidebarSection key={index} icon={item.icon} text={item.text} href={item.href} submenu={item.submenu} />
            ))}
          </ul>
        </nav>
      </aside>
    </Fragment>
  );
}

// Validate the function arguments
Sidebar.propTypes = {
  items: PropTypes.array.isRequired, // The list of menu items
  isMobile: PropTypes.bool.isRequired, // The flag to indicate mobile view
};

// Export the Sidebar component
export default Sidebar;
