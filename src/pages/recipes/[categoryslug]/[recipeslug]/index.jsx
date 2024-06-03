/*
Version: 1.9
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Recipe page to display detailed information about a recipe
*/

// Import the Fragment component from React
import { Fragment } from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";
// Import the apiRequest function from the apiRequest library
import apiRequest from '@/lib/apiRequest';
// Import the RecipeView component for displaying a recipe
import RecipeView from "@/components/recipes/recipeview";
// Import the slugify function from the utils library
import { slugify } from "@/lib/utils";

/**
 * RecipePage component to display detailed information about a recipe.
 * @param {object} recipe - the recipe object
 * @returns {JSX.Element}
 * @constructor
 */
const RecipePage = ({ recipe }) => {
  // Return the recipe page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>{recipe.title} | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="View detailed information about a recipe" />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Recipe view */}
        <RecipeView recipe={recipe} />
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the RecipePage component
RecipePage.propTypes = {
  recipe: PropTypes.object.isRequired, // Recipe object
};

// Export the RecipePage component
export const getServerSideProps = async (context) => {
  // Get the category slug and recipe slug from the context query
  const { categoryslug, recipeslug } = context.query;
  // Check if the recipe slug is not empty
  if (!recipeslug) {
    return {
      notFound: true,
    };
  }

  // Fetch the recipe data from the API
  try {
    const response = await apiRequest(`recipes/${recipeslug}`, 'GET', null, context);

    // Check if the response is successful
    if (response && response.success) {
      // Generate the recipe category slug
      const recipeCategorySlug = slugify(response.data.type);
      // Redirect to the correct URL if the category slug does not match
      if (recipeCategorySlug !== categoryslug) {
        return {
          redirect: {
            destination: `/recipes/${recipeCategorySlug}/${recipeslug}`,
            permanent: true,
          },
        };
      } else {
        // Return the recipe data as props
        return {
          props: {
            recipe: response.data,
          },
        };
      }
    } else {
      // Return a 404 error if the response is not successful
      return {
        notFound: true,
      };
    }
  } catch (error) {
    // Return a 404 error if there is an error fetching the recipe data
    return {
      notFound: true,
    };
  }
};

// Export the RecipePage component
export default RecipePage;
