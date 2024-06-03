/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A sidebar section component for the application layout displaying the menu section.
*/

// Import the Fragment component, useState and useEffect hooks from React
import { Fragment, useState, useEffect } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import the SidebarItem component for the sidebar menu items
import SidebarItem from './sidebaritem';

/**
 * SidebarSection component to display the menu section with icon, text, and submenu items.
 * SidebarSection component properties:
 * @param {element} icon - the icon component for the menu section
 * @param {string} text - the text for the menu section
 * @param {array} submenu - the list of submenu items
 * @param {string} href - the link for the menu section
 * @returns {JSX.Element} - the menu section with icon, text, and submenu items
 */
function SidebarSection({ icon, text, submenu, href }) {
  // Get the router object for routing
  const router = useRouter();
  // Define the state for submenu visibility
  const [isOpen, setIsOpen] = useState(false);
  // Hook to handle the submenu visibility
  useEffect(() => {
    // Check if the submenu items exist
    if (submenu) {
    // Check if the submenu items are active
      const isActive = submenu.some(item => router.asPath.includes(item.href));
      // Set the submenu visibility based on the active state
      setIsOpen(isActive);
    }
  }, [router.asPath, submenu]); // Update the submenu visibility on path change

  // Function to toggle the submenu visibility
  const toggleSubmenu = (e) => {
    // Prevent the event future propagation
    e.stopPropagation();
    // Prevent the default event behavior
    e.preventDefault();
    // Toggle the submenu visibility
    setIsOpen(!isOpen);
  };

  // Function to check if the menu section is active
  const isActive = (path, isParent= true) =>{
    // Check if the menu section is a parent
    if (isParent) {
      // Return the active state based on the exact path match
      return router.asPath === path;
    } else {
      // Return the active state based on the path inclusion
      return router.asPath.includes(path);
    }
  };

  // Function to get the parent style based on the submenu visibility
  const getParentStyle = (href) => {
    // Return the parent style based on the submenu visibility
    if (isOpen) {
      // Return the active style for the open submenu
      return 'bg-red-700 text-white';
    } else {
      // Return the active style for the active menu section
      return isActive(href) ? 'bg-red-600 text-white' : '';
    }
  }

  // Return the sidebar section
  return (
    <Fragment>
    {/* Sidebar section block */}
      <li className={`sidebar-row group flex flex-col items-start py-2 px-3 my-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer  ${getParentStyle(href)}`}>
        {/* Sidebar item with icon and text */}
        <Link href={href?href:"#"} passHref className="w-full sidebar-item">
          <SidebarItem icon={icon} text={text} submenu={submenu && submenu.length > 0} isOpen={isOpen} toggleSubmenu={toggleSubmenu} />
        </Link>
        {/* Submenu items */}
        {isOpen && submenu && ( // Check if the submenu items exist and the submenu is open
          <ul className="aside-item-child w-full pl-2 pt-4">
            {/* Map through the list of submenu items */}
            {submenu.map((item, index) => (
              <li key={index} className={`sidebar-item py-1 pl-4 rounded-md flex items-center hover:bg-red-600 ${isActive(item.href, false) ? 'bg-red-600 text-white' : ''}`}>
                {/* Submenu item with icon and text */}
                <Link href={item.href} passHref className="w-full">
                  <SidebarItem icon={item.icon} text={item.text}/>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </Fragment>
  );
}

// Validate the SidebarSection component properties
SidebarSection.propTypes = {
  icon: PropTypes.element.isRequired, // Icon component
  text: PropTypes.string.isRequired, // Text for the menu section
  submenu: PropTypes.array, // List of submenu items
  href: PropTypes.string, // Link for the menu section
};

// Export the SidebarSection component
export default SidebarSection;
