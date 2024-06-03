/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A recipe card component for displaying recipe details.
*/

// Import the Fragment component from React
import { Fragment } from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Image component from Next.js for image optimization
import { useRouter } from 'next/router';
// Import the format function from date-fns for date formatting
import Link from 'next/link';
// Import the StarIcon component from Heroicons for rating
import { useSession } from 'next-auth/react';
// Import the Tag component for displaying tags
import RecipeCard from "@/components/recipes/recipecard";
// Import the EditIcon component from Heroicons for editing

/**
 * RecipeTable component to display a table of recipes with title, description, ingredients, cook time, instructions, tags, and type.
 * RecipeTable component properties:
 * @param {string} title - the title of the recipe table
 * @param {list} recipes - the list of recipes to display
 * @param {int} page - the current page number
 * @param {int} totalPages - the total number of pages
 * @returns {JSX.Element} - the recipe table with title and recipes
 */
const RecipeTable = ({ title, recipes, page = 1, totalPages = 1 }) => {
  // Get the session object for user authentication
  const { data: session, status } = useSession();
  // Define the loading state based on the session status
  const loading = status === 'loading';
  // Get the user object based on the session status
  const user = loading ? null : session?.user;
  // Get the router object for routing
  const router = useRouter();

  // Function to get the page link based on the page number
  const getPageLink = (newPage) => {
    // Create a new query object based on the current query
    const query = { ...router.query };
    // Check if the new page is the first page
    if (newPage === 1) {
      // Remove the page query parameter if it is the first page
      delete query.page;
    } else {
      // Set the page query parameter to the new page
      query.page = newPage;
    }
    // Return the page link with the new query
    return { pathname: router.pathname, query };
  };

  // Return the recipe table view
  return (
    <Fragment>
      {/* Recipe Table Title */}
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {/* Recipe Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Check if there are recipes */}
        {recipes.length > 0 ? (
          // Loop through the recipes and display each recipe card
          recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} user={user} />
          ))
        ) : (
          // Display a message if no recipes are found
          <div className="col-span-full text-center text-gray-500">
            No recipes found.
          </div>
        )}
      </div>
        {/* Display pagination if there are more than one page */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          {/* Display previous page button, disabled if first page */}
          <Link
            href={getPageLink(page - 1)}
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={page === 1}
          >
            Previous
          </Link>
          {/* Display page number and total pages */}
          <span>
            Page {page} of {totalPages}
          </span>
          {/* Display next page button, disabled if last page */}
          <Link
            href={getPageLink(page + 1)}
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={page === totalPages}
          >
            Next
          </Link>
        </div>
      )}
    </Fragment>
  );
};

// Validate the RecipeTable component properties
RecipeTable.propTypes = {
  title: PropTypes.string.isRequired, // Recipe table title
  recipes: PropTypes.array.isRequired, // List of recipes to display
  page: PropTypes.number, // Current page number (default is 1)
  totalPages: PropTypes.number, // Total number of pages (default is 1)
};

// Export the RecipeTable component
export default RecipeTable;
