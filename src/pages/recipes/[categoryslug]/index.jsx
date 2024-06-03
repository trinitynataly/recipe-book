/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Recipe category page to display recipes by category
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
// Import the useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import the categories data
import categories from '@/data/categories.json';

/**
 * RecipeCategory component to display recipes by category.
 * @param {array} recipes - the list of recipes
 * @param {object} pagination - the pagination object
 * @returns {JSX.Element}
 */
const RecipeCategory = ({ recipes, pagination }) => {
  // Get the router object
  const router = useRouter();
  // Get the category slug from the router query
  const { categoryslug } = router.query;
  // Find the category by slug
  const category = categories.find(cat => cat.slug === categoryslug);
  // Get the category title
  const categoryTitle = category ? category.name : 'Recipes';

  // Return the recipe category page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>{categoryTitle} Recipes | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content={`${categoryTitle} Recipes`} />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Recipe category page */}
        <div className="container mx-auto px-4 py-8">
          {/* Recipe table */}
          <RecipeTable
            title={`${categoryTitle} Recipes`}
            recipes={recipes}
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the RecipeCategory component
RecipeCategory.propTypes = {
  recipes: PropTypes.array.isRequired, // List of recipes
  pagination: PropTypes.object.isRequired, // Pagination object
};

// Server-side function to fetch the recipes data by category
export const getServerSideProps = async (context) => {
  // Get the category slug from the URL parameters
  const { categoryslug } = context.params;
  // Get the page number from the URL query parameters
  const page = parseInt(context.query.page) || 1;
  // Find the category by slug
  const category = categories.find(cat => cat.slug === categoryslug);

  // Return a 404 error if the category is not found
  if (!category) {
    return {
      notFound: true,
    };
  }

  // Init the recipes and pagination variables
  let recipes = [];
  let pagination = {};
  // Init the data object with the category name and page number for the API
  let data = {
    type: category.name,
    page,
  };

  try {
    // Fetch the recipes data by category from the API
    const response = await apiRequest(`recipes`, 'GET', data, context);
    // If the response is successful, set the recipes and pagination variables
    if (response.success) {
      recipes = response.data; // Set the recipes
      pagination = response.pagination; // Set the pagination object
    }
  } catch (error) {
    // Log the error if there is an issue fetching the recipes
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

// Export the RecipeCategory component
export default RecipeCategory;
