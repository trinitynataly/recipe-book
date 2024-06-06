/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
A layout component for the application with sidebar, top bar, and footer.
*/

// Import the Fragment, useState and useEffect hooks from React
import { Fragment, useState, useEffect } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the useSession hook from NextAuth for session management
import { useSession } from 'next-auth/react';
// Import the useBlog hook from the BlogContext for blog data
import { useBlog } from '@/context/BlogContext';
// Import the Sidebar, TopBar, and Footer components
import Sidebar from './sidebar';
import TopBar from './topbar';
import Footer from './footer';
// Import the icons for the sidebar menu items
import BreakfastIcon from '../../../public/icons/brekfast.svg';
import LunchIcon from '../../../public/icons/lunch.svg';
import DinnerIcon from '../../../public/icons/dinner.svg';
import SnacksIcon from '../../../public/icons/snacks.svg';
import DashboardIcon from '../../../public/icons/dashboard.svg';
import BookIcon from '../../../public/icons/book.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import InfoIcon from '../../../public/icons/info.svg';
import ExitIcon from '../../../public/icons/exit.svg';

/**
 * Layout component to wrap the application with sidebar, top bar, and footer.
 * Layout component properties:
 * @param {array} children - the child components
 * @returns {JSX.Element} - the application layout with sidebar, top bar, and footer
 */
function Layout({ children }) {
  // Get the session data and status from the useSession hook
  const { data: session, status } = useSession();
  // Check if the session is loading
  const loading = status === 'loading';
  // Get the user data from the session or set it to null
  const user = loading ? null : session?.user;
  // Define the state for dark mode and mobile view
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Define the state for mobile view, null by default for initial check
  const [isMobile, setIsMobile] = useState(null);
  // Get the blog categories from the useBlog hook
  const { categories } = useBlog();

  // Hook to handle window resize events
  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      // Check if the window width is less than or equal to 800 pixels
      setIsMobile(window.innerWidth <= 800);
    };
    handleResize(); // Initial check
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array for initial check

  // Hook to handle dark mode theme
  useEffect(() => {
    // Get the theme from local storage
    const theme = localStorage.getItem('theme');
    // Check if the theme is dark
    if (theme === 'dark') {
      // Set the dark mode state to true
      setIsDarkMode(true);
      // Add the dark mode class to the document
      document.documentElement.classList.add('dark');
    } else {
      // Set the dark mode state to false
      setIsDarkMode(false);
      // Remove the dark mode class from the document
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Function to toggle the dark mode theme
  const toggleTheme = () => {
    // Toggle the dark mode state
    setIsDarkMode(!isDarkMode);
    // Check if dark mode is enabled
    if (isDarkMode) {
      // Remove the dark mode class from the document
      document.documentElement.classList.remove('dark');
      // Set the theme to light in local storage
      localStorage.setItem('theme', 'light');
    } else {
      // Add the dark mode class to the document
      document.documentElement.classList.add('dark');
      // Set the theme to dark in local storage
      localStorage.setItem('theme', 'dark');
    }
  };

  // Generate the blog submenu items for the sidebar
  const blogSubMenu = categories?.map((category) => ({ // Check if categories exist
    text: category.title, // Set the text to the category title
    href: `/blog/${category.slug}`, // Set the href to the category slug
    icon: <BookIcon />, // Set the icon to the book icon
  }));

  // Define the sidebar menu items
  const menuItems = [
    { // Dashboard menu item
      text: 'All Recipes', // Set the text to All Recipes
      href: '/', // Set the href to the root path
      icon: <DashboardIcon />, // Set the icon to the dashboard icon
      submenu: [ // Define the submenu items
        { text: 'Breakfast', href: '/recipes/breakfast', icon: <BreakfastIcon /> }, // Breakfast submenu item
        { text: 'Lunch', href: '/recipes/lunch', icon: <LunchIcon /> }, // Lunch submenu item
        { text: 'Dinner', href: '/recipes/dinner', icon: <DinnerIcon /> }, // Dinner submenu item
        { text: 'Snacks', href: '/recipes/snacks', icon: <SnacksIcon /> }, // Snacks submenu item
      ],
    },
    // Check if the user is logged in and add the My Favourites menu item
    user && { text: 'My Favourites', href: '/recipes/favorites', icon: <HeartIcon /> },
    // Blog menu item with submenu
    { text: 'Blog', href: '/blog', icon: <BookIcon />, submenu: blogSubMenu },
    // About menu item
    { text: 'About', href: '/about', icon: <InfoIcon /> },
    // Sign In or Sign Out menu item based on user session
    user && { text: 'Sign Out', href: '/logout', icon: <ExitIcon /> },
  ].filter(Boolean); // Filter out null item

  // Check if the mobile view is loading
  if (isMobile === null) {
    // Return a spinner loader while loading
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="spinner"></div>
      </div>
    );
  }

  // Return the application layout with sidebar, top bar, and footer
  return (
    <Fragment>
      {/* Main div with check for isMobile */}
      <div className={`flex min-h-screen ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {/* Sidebar component with menu items */}
        <Sidebar items={menuItems} isMobile={isMobile} />
        {/* Main content div */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? '' : 'ml-80'}`}> {/* Adjust margin-left to account for sidebar width */}
          {/* TopBar component with dark mode toggle */}  
          <TopBar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          {/* Main content div with children */}
          <main className="flex-1 overflow-auto p-4 bg-backgroundEnd dark:bg-darkBackgroundEnd text-foreground dark:text-foreground">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}

// Validate the function arguments
Layout.propTypes = {
  children: PropTypes.node.isRequired, // The child components
};

// Export the Layout component
export default Layout;
