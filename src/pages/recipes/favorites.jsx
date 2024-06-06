/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
Favorites page to display favourite recipes
*/

// Import the Fragment component from React
import { Fragment } from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";
// Import the RecipeTable component for displaying recipes
import RecipeTable from "@/components/recipes/recipetable";
// Import the apiRequest function from the apiRequest library
import apiRequest from '@/lib/apiRequest';

/**
 * Favorites component to display favourite recipes.
 * @param {array} recipes - the list of recipes
 * @param {object} pagination - the pagination object
 * @returns {JSX.Element}
 */
const Favorites = ({ recipes, pagination }) => {
  // Get the current page and total pages from the pagination object
  const { currentPage, totalPages } = pagination;

  // Add the favorite flag to the recipes
  const recipesWithFavorite = recipes.map(recipe => ({
    ...recipe, // Spread the recipe object
    favorite: true, // Add the favorite flag as true
  }));

  // Return the favourites page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>My Favourite Recipes | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="My Favourite Recipes" />
      </Head>
        {/* Layout wrapper */}
      <Layout>
        {/* Favourites page */}
        <div className="container mx-auto px-4 py-8">
          {/* Recipe table */}
          <RecipeTable
            title="My Favourite Recipes"
            recipes={recipesWithFavorite}
            page={currentPage}
            totalPages={totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the Favorites component
Favorites.propTypes = {
  recipes: PropTypes.array.isRequired, // List of recipes
  pagination: PropTypes.object.isRequired, // Pagination object
};

// Server-side function to fetch the favourite recipes data
export const getServerSideProps = async (context) => {
  // Get the page number from the URL query parameters
  const page = parseInt(context.query.page) || 1;
  // Initialize the recipes and pagination variables
  let recipes = [];
  let pagination = {
    currentPage: 1, // Current page number
    totalPages: 1, // Total number of pages
  };
  // Initialize the data object
  let data = {
    page, // Set the page number
    favorite: 1 // Set the favorite flag to 1
  }

  try {
    // Fetch the favourite recipes from the API
    const response = await apiRequest(`recipes`, 'GET', data, context);
    // If the response is successful, set the recipes and pagination variables
    if (response.success) {
      recipes = response.data; // Set the recipes
      pagination = response.pagination; // Set the pagination object
    }
  // Catch any errors
  } catch (error) {
    // Log the error to the console
    console.error('Error fetching recipes:', error);
  }

    // Return the recipes and pagination as props
  return {
    props: {
      recipes, // List of recipes
      pagination, // Pagination object
    },
  };
};

// Export the Favorites component
export default Favorites;
