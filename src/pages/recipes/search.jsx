/*
Version: 1.
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Search results page to display search results
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
 * SearchResults component to display search results.
 * @param {string} keyword - the search keyword
 * @param {array} recipes - the list of recipes
 * @param {object} pagination - the pagination object
 * @returns {JSX.Element}
 */
const SearchResults = ({ keyword, recipes, pagination }) => {
  // Return the search results page view
  const { currentPage, totalPages } = pagination;

  // Return the search results page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Search Results for &quot;{keyword}&quot; | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content={`Search results for "${keyword}"`} />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Search results page */}
        <div className="container mx-auto px-4 py-8">
          {/* Recipe table */}
          <RecipeTable
            title={`Search Results for "${keyword}"`}
            recipes={recipes}
            page={currentPage}
            totalPages={totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the SearchResults component
SearchResults.propTypes = {
  keyword: PropTypes.string.isRequired, // Search keyword
  recipes: PropTypes.array.isRequired, // List of recipes
  pagination: PropTypes.object.isRequired, // Pagination object
};

// Server-side function to fetch search results
export const getServerSideProps = async (context) => {
  // Get the search keyword from the URL query parameters
  const keyword = context.query.keyword.trim() || '';
  // Get the page number from the URL query parameters
  const page = parseInt(context.query.page) || 1;
  // Init the recipes and pagination variables
  let recipes = [];
  let pagination = {};

  // Redirect to the home page if there is no search keyword
  if (!keyword) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Init the data object with the keyword and page number for the API
  const data = {
    keyword, // Search keyword
    page, // Page number
  };
  try {
    // Fetch the search results from the API
    const response = await apiRequest(`recipes/search`, 'GET', data, context);
    // If the response is successful, set the recipes and pagination variables
    if (response.success) {
      recipes = response.data;
      pagination = response.pagination;
    }
  // Catch any errors
  } catch (error) {
    // Log the error if there is an issue fetching the search results
    console.error('Error fetching search results:', error);
  }

  // Return the search results and pagination as props
  return {
    props: {
      keyword, // the search keyword
      recipes, // the list of recipes
      pagination, // the pagination object
    },
  };
};

// Export the SearchResults component
export default SearchResults;
