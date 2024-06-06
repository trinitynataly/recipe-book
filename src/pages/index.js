/*
Version: 1.4
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
Home page displaying a list of recipes
*/

// Import the Fragment, useState, and useEffect hooks from React
import { Fragment, useState, useEffect } from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";
// Import the RecipeCategories component for displaying recipe categories
import RecipeCategories from "@/components/recipes/recipecategories";
// Import the RecipeTable component for displaying recipes
import RecipeTable from "@/components/recipes/recipetable";
// Import Session from NextAuth for session management
import { getSession } from 'next-auth/react';
// Import the apiRequest function from the apiRequest library
import apiRequest from '@/lib/apiRequest';
// Import the data for the recipe categories
import categories from "@/data/categories.json";

// Define the number of recipes per page
const RECIPES_PER_PAGE = 12;

/**
 * Home component to display the home page with a list of recipes.
 * @param {array} recipes - the list of recipes
 * @param {object} pagination - the pagination object
 * @returns {JSX.Element}
 */
const Home = ({ recipes }) => {
  // Create a state variable for the favorite recipe IDs
  const [ favoriteIds, setFavoriteIds ] = useState([]);

  // Fetch the user's favorite recipe IDs from the API on page load if the user is authenticated
  useEffect(() => {
    // Define an async function to fetch the user's favorite recipe IDs
    const fetchFavorites = async () => {
      // Get the session object
      const session = await getSession();
      // If the session is available, fetch the user's favorite recipe IDs
      if (session) {
        try {
          // Fetch the user's favorite recipe IDs from the API
          const favoriteResponse = await apiRequest(`recipes/favorites`, 'GET', {}, {});
          // If the response is successful, set the favorite recipe IDs
          if (favoriteResponse.success) {
            // Set the favorite recipe IDs
            setFavoriteIds(favoriteResponse.data);
          } else {
            // If the response is not successful, set the favorite recipe IDs to an empty array
            setFavoriteIds([]);
          }
        } catch (error) {
          // On error set the favorite recipe IDs to an empty array
          setFavoriteIds([]);
        }
      }
    };

    // Call the fetchFavorites function on page load
    fetchFavorites();
  }, []);

    // Map the recipes to include the favorite status
    const recipesWithFavorite = recipes.map(recipe => ({
      ...recipe, // Spread the recipe object
      favorite: favoriteIds ? favoriteIds.includes(recipe._id) : false, // Set the favorite status based on the favorite recipe IDs
    }));
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Welcome | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Welcome to Recipe Book App" />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Home page */}
        <div className="container mx-auto px-4 py-8">
          {/* Recipe table */}
          <RecipeTable
            title="Fresh Recipes"
            recipes={recipesWithFavorite}
          />
          <RecipeCategories categories={categories} />
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the Home component
Home.propTypes = {
  recipes: PropTypes.array.isRequired, // List of recipes
  pagination: PropTypes.object.isRequired, // Pagination object
  favoriteIds: PropTypes.array, // List of favorite recipe IDs
};

// Static function to fetch the recipes data
export const getStaticProps = async (context) => {
  // Get the page number from the URL query parameters (default to 1)
  const { page = 1 } = context.params || {};
  // Parse the page number as an integer
  const pageInt = parseInt(page, 10);
  // Set the number of recipes per page
  const perPageInt = 6; // Set the number of recipes per page as needed

  // Init the recipes and pagination variables
  let recipes = [];
  let pagination = {};

  // Init the data object
  let data = {
    page: pageInt, // Set the page number
    per_page: perPageInt, // Set the number of recipes per page
  };

  try {
    // Fetch the recipes data from the API
    const recipeResponse = await apiRequest(`recipes`, 'GET', data);
    // If the response is successful, set the recipes and pagination variables
    if (recipeResponse.success) {
      // Set the recipes and pagination variables
      recipes = recipeResponse.data;
    }
  } catch (error) {
    // Log the error if there is an issue fetching the recipes
    console.error('Error fetching recipes:', error);
  }

  // Return the recipes and pagination as props
  return {
    props: {
      recipes, // the list of recipes
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

// Export the Home component
export default Home;
