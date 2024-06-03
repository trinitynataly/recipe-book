/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
A context provider for managing blog categories.
*/

// Import the createContext and useContext functions from React
import { createContext, useContext, useState } from 'react';

// Create a new context for managing blog categories
const BlogContext = createContext();

/**
 * BlogProvider component to manage blog categories.
 * BlogProvider component properties:
 * @param children - the child components
 * @param {array} initialCategories - the initial list of blog categories
 * @returns {JSX.Element} - the provider component for managing blog categories
 */
export const BlogProvider = ({ children, initialCategories }) => {
  // Define the state for blog categories
  const [categories, setCategories] = useState(initialCategories);

  // Return the BlogContext provider with the categories state and setCategories function
  return (
    <BlogContext.Provider value={{ categories, setCategories }}>
      {children}
    </BlogContext.Provider>
  );
};

// Export the useBlog hook to access the blog categories
export const useBlog = () => useContext(BlogContext);
