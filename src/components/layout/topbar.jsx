/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A toast component for the application layout displaying the notification message.
*/

// Import the Fragment component and useState hook from React
import { Fragment, useState } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import useSession hook from NextAuth for session management
import { useSession } from 'next-auth/react';
// Import the Sun and Moon icons from Heroicons for theme toggle
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
// Import the styles module for the top bar
import styles from '../../styles/scss/components/layout/topbar.module.scss';

/**
 * TopBar component to display the top navigation bar with search and theme toggle.
 * TopBar component properties:
 * @param {function} onToggleTheme - the function to toggle the theme
 * @param {boolean} isDarkMode - the flag to indicate dark mode
 * @returns {JSX.Element} - the top navigation bar with search and theme toggle
 */
const TopBar = ({ onToggleTheme, isDarkMode }) => {
  // Define the state for the search query
  const [searchQuery, setSearchQuery] = useState('');
  // Get the router object for routing
  const router = useRouter();
  // Get the session object for user authentication
  const { data: session, status } = useSession();
  // Define the loading state based on the session status
  const loading = status === 'loading';
  // Get the user object based on the session status
  const user = loading ? null : session?.user;

  // Function to handle the search query change
  const handleSearchChange = (e) => {
    // Set the search query based on the input value
    setSearchQuery(e.target.value);
  };

  // Function to handle the search form submission
  const handleSearchSubmit = (e) => {
    // Prevent the default form submission
    e.preventDefault();
    // Redirect to the search results page with the search query
    router.push(`/recipes/search?keyword=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Fragment>
      {/* Top navigation bar with search and theme toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700">
        {/* Search form with input and button */}
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          {/* Search input for recipes */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Recipes"
            className="p-2 rounded-l border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0.5 focus:ring-primary focus:border-gray-600 w-full"
          />
          {/* Search button for recipes */}
          <button type="submit" className="p-2 bg-gray-400 text-white rounded-r border border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:bg-gray-600">
            Search
          </button>
        </form>
        {/* Buttons */}
        <div className="flex items-center flex-nowrap">
          {user ? (
            // New Recipe button for authenticated users
            <Link href="/recipes/new" className="ml-4 bg-primary hover:bg-tertiary text-white px-4 py-2 rounded text-nowrap">
              + New Recipe
            </Link>
          ) : (
            // Sign In button for unauthenticated users
            <Link href="/login" className="ml-4 bg-primary hover:bg-tertiary text-white px-4 py-2 rounded text-nowrap">
              Sign In
            </Link>
          )}
          {/* Theme toggle button */}
          <button
            onClick={onToggleTheme}
            className="ml-4 p-2 rounded-full bg-gray-300 dark:bg-gray-800"
          >
            {isDarkMode ? (
              // Sun icon for light theme
              <SunIcon className={`w-6 h-6 ${styles.sparkle} ${styles.sparkleSun}`} />
            ) : (
              // Moon icon for dark theme
              <MoonIcon className={`w-6 h-6 ${styles.sparkle} ${styles.sparkleMoon}`} />
            )}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

// Validate the TopBar component properties
TopBar.propTypes = {
  onToggleTheme: PropTypes.func.isRequired, // Function to toggle the theme
  isDarkMode: PropTypes.bool.isRequired, // Flag to indicate dark mode
};

export default TopBar;
