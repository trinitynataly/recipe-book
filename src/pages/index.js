/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Home page displaying a list of recipes
*/

// Import the Fragment from React
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
 * Home component to display the home page with a list of recipes.
 * @param {array} recipes - the list of recipes
 * @param {object} pagination - the pagination object
 * @returns {JSX.Element}
 */
const Home = ({ recipes, pagination }) => {
  // Return the home page view
  const { currentPage, totalPages } = pagination;
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
            title="Recipe Book"
            recipes={recipes}
            page={currentPage}
            totalPages={totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the Home component
Home.propTypes = {
  recipes: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
};

// Server-side function to fetch the recipes data
export const getServerSideProps = async (context) => {
  // Get the page number from the URL query parameters
  const page = parseInt(context.query.page) || 1;
  // Init the recipes and pagination variables
  let recipes = [];
  let pagination = {};
  // Init the data object with the page number for the API
  let data = {
    page,
  }

  try {
    // Fetch the recipes data from the API
    const response = await apiRequest(`recipes`, 'GET', data, context);
    // If the response is successful, set the recipes and pagination variables
    if (response.success) {
      // Set the recipes and pagination variables
      recipes = response.data;
      // Set the pagination object
      pagination = response.pagination;
    }
  } catch (error) {
    // Log the error if there is an issue fetching the recipes
    console.error('Error fetching recipes:', error);
  }

  // Return the recipes and pagination as props
  return {
    props: {
      recipes, // the list of recipes
      pagination, // the pagination object
    },
  };
};

// Export the Home component
export default Home;
